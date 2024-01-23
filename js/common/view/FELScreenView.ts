// Copyright 2024, University of Colorado Boulder

/**
 * FELScreenView is the base class for all ScreenViews in this sim.  It creates the UI elements that are common to
 * all screens, and handles layout that is common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import FELConstants from '../../common/FELConstants.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node } from '../../../../scenery/js/imports.js';
import Multilink from '../../../../axon/js/Multilink.js';
import FieldNode from '../../common/view/FieldNode.js';
import FieldMeterNode from '../../common/view/FieldMeterNode.js';
import CompassNode from '../../common/view/CompassNode.js';
import Magnet from '../model/Magnet.js';
import Compass from '../model/Compass.js';
import FieldMeter from '../model/FieldMeter.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import PickupCoilNode from './PickupCoilNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

type SelfOptions = {
  magnet: Magnet;
  compass: Compass;
  fieldMeter: FieldMeter;
  panels: Node;
  timeControlNode?: Node | null;
  developerAccordionBox: Node;
  resetAll: () => void;
};

type FELScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class FELScreenView extends ScreenView {

  // It is the subclass' responsibility to add these to the scenegraph and pdomOrder.
  protected readonly fieldNode: Node;
  protected readonly fieldMeterNode: Node;
  protected readonly compassNode: Node;
  protected readonly resetAllButton: Node;

  public constructor( providedOptions: FELScreenViewOptions ) {

    const options = optionize<FELScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // SelfOptions
      timeControlNode: null,

      // ScreenViewOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    this.fieldNode = new FieldNode( options.magnet, this.visibleBoundsProperty, options.tandem.createTandem( 'fieldNode' ) );

    this.compassNode = new CompassNode( options.compass, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: options.tandem.createTandem( 'compassNode' )
    } );

    this.fieldMeterNode = new FieldMeterNode( options.fieldMeter, {
      dragBoundsProperty: this.visibleBoundsProperty,
      tandem: options.tandem.createTandem( 'fieldMeterNode' )
    } );

    this.resetAllButton = new ResetAllButton( {
      listener: () => {
        this.interruptSubtreeInput(); // cancel interactions that may be in progress
        options.resetAll();
      },
      tandem: options.tandem.createTandem( 'resetAllButton' )
    } );

    // Panels top aligned with layoutBounds, right aligned with visible bounds.
    Multilink.multilink( [ this.visibleBoundsProperty, options.panels.boundsProperty ],
      ( visibleBounds, panelsBounds ) => {
        options.panels.right = visibleBounds.right - FELConstants.SCREEN_VIEW_X_MARGIN;
        options.panels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    // ResetAllButton in the right bottom corner of the visible bounds.
    this.visibleBoundsProperty.link( visibleBounds => {
      this.resetAllButton.right = visibleBounds.maxX - FELConstants.SCREEN_VIEW_X_MARGIN;
      this.resetAllButton.bottom = visibleBounds.maxY - FELConstants.SCREEN_VIEW_Y_MARGIN;
    } );

    // Developer accordion box in the left top corner of the visible bounds.
    Multilink.multilink( [ this.visibleBoundsProperty, options.developerAccordionBox.boundsProperty ],
      ( visibleBounds, developerAccordionBoxBounds ) => {
        options.developerAccordionBox.left = visibleBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
        options.developerAccordionBox.top = visibleBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    // Time control at center bottom of the visible bounds.
    if ( options.timeControlNode ) {
      this.visibleBoundsProperty.link( visibleBounds => {
        options.timeControlNode!.centerX = visibleBounds.centerX;
        options.timeControlNode!.bottom = visibleBounds.bottom - FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );
    }
  }

  /**
   * Creates a dragBoundsProperty for scenarios that do not involve the 'Lock to Axis' feature.
   * This is relevant in the 'Bar Magnet' and 'Electromagnet' screens.
   */
  protected createDragBoundsProperty( panelsBoundsProperty: TReadOnlyProperty<Bounds2> ): TReadOnlyProperty<Bounds2> {
    return new DerivedProperty( [ panelsBoundsProperty ],
      panelsBounds => new Bounds2(
        this.layoutBounds.left,
        this.layoutBounds.top,
        panelsBounds.left,
        this.layoutBounds.bottom
      ), {
        strictAxonDependencies: false //TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/57
      } );
  }

  /**
   * Configures a dragBoundsProperty for scenarios that involve a magnet and a pickup coil, and require the
   * 'Lock to Axis' feature. This is relevant in the 'Pickup Coil' and 'Transformer' screens.
   */
  protected configureDragBoundsProperty(
    dragBoundsProperty: Property<Bounds2>,
    isLockedToAxisProperty: TReadOnlyProperty<boolean>,
    panelsBoundsProperty: TReadOnlyProperty<Bounds2>,
    magnetPositionProperty: Property<Vector2>,
    pickupCoilPositionProperty: Property<Vector2>,
    magnetNode: Node,
    pickupCoilNode: PickupCoilNode
  ): void {
    Multilink.multilink( [ isLockedToAxisProperty, panelsBoundsProperty ], ( isLockedToAxis, panelsBounds ) => {
      if ( isLockedToAxis ) {
        // Dragging is locked to 1D, horizontally along the pickup coil's axis.

        // Move the pickup coil and magnet to a usable position.
        const y = pickupCoilPositionProperty.initialValue.y;
        pickupCoilPositionProperty.value = new Vector2( pickupCoilPositionProperty.value.x, y );
        magnetPositionProperty.value = new Vector2( magnetPositionProperty.value.x, y );

        // Change the cursors to indicate that drag direction is constrained to horizontal.
        magnetNode.cursor = 'ew-resize';
        pickupCoilNode.cursor = 'ew-resize';
        pickupCoilNode.backgroundNode.cursor = 'ew-resize';

        // Constrain to horizontal dragging.
        dragBoundsProperty.value = new Bounds2( this.layoutBounds.left, y, panelsBounds.left, y );
      }
      else {
        // Dragging is 2D, horizontal and vertical.

        // Restore cursors.
        magnetNode.cursor = 'pointer';
        pickupCoilNode.cursor = 'pointer';
        pickupCoilNode.backgroundNode.cursor = 'pointer';

        // Restore drag bounds.
        dragBoundsProperty.value = new Bounds2(
          this.layoutBounds.left,
          this.layoutBounds.top,
          panelsBounds.left,
          this.layoutBounds.bottom
        );
      }
    } );
  }
}

faradaysElectromagneticLab.register( 'FELScreenView', FELScreenView );