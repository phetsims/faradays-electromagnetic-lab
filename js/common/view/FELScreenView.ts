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
import { Line, Node } from '../../../../scenery/js/imports.js';
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
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import FELQueryParameters from '../FELQueryParameters.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import BarMagnetNode from './BarMagnetNode.js';
import ElectromagnetNode from './ElectromagnetNode.js';

type SelfOptions = {

  // Required UI components that are common to all screens.
  magnet: Magnet;
  compass: Compass;
  fieldMeter: FieldMeter;
  developerAccordionBox: Node;

  // Panels on left and right sides of the screen.
  // It is the subclass' responsibility to add these to the scene graph and pdomOrder.
  leftPanels?: Node;
  rightPanels: Node;

  // Optional UI components.
  timeControlNode?: Node | null;

  // Called when the resetAllButton is pressed.
  resetAll: () => void;
};

type FELScreenViewOptions = SelfOptions & PickRequired<ScreenViewOptions, 'tandem'>;

export default class FELScreenView extends ScreenView {

  // It is the subclass' responsibility to add these to the scene graph and pdomOrder.
  protected readonly fieldNode: Node;
  protected readonly fieldMeterNode: Node;
  protected readonly compassNode: Node;
  protected readonly resetAllButton: Node;

  protected constructor( providedOptions: FELScreenViewOptions ) {

    const options = optionize<FELScreenViewOptions, StrictOmit<SelfOptions, 'leftPanels'>, ScreenViewOptions>()( {

      // SelfOptions
      timeControlNode: null,

      // ScreenViewOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    this.fieldNode = new FieldNode( options.magnet, this.visibleBoundsProperty, options.tandem.createTandem( 'fieldNode' ) );

    this.compassNode = new CompassNode( options.compass, {
      // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/10#issuecomment-1911160748
      dragBoundsProperty: new DerivedProperty( [ this.visibleBoundsProperty, options.rightPanels.boundsProperty ],
        ( visibleBounds, panelsBounds ) => visibleBounds.withMaxX( panelsBounds.left ), {
          strictAxonDependencies: false // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/65
        } ),
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

    // Prevent the panels from growing taller than the available space, and overlapping resetAllButton.
    // This is a last-ditch defense, in case we are running on a platform where fonts are significantly taller.
    const maxHeightPanels = this.layoutBounds.height - this.resetAllButton.height - ( 2 * FELConstants.SCREEN_VIEW_Y_MARGIN ) - 5;
    if ( options.leftPanels ) {
      options.leftPanels.maxHeight = maxHeightPanels;
    }
    options.rightPanels.maxHeight = maxHeightPanels;

    // Left panels top-aligned with layoutBounds, left-aligned with visible bounds.
    if ( options.leftPanels ) {
      const leftPanels = options.leftPanels;
      Multilink.multilink( [ this.visibleBoundsProperty, leftPanels.boundsProperty ],
        ( visibleBounds, panelsBounds ) => {
          leftPanels.left = visibleBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN;
          leftPanels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
        } );
    }

    // Right panels top-aligned with layoutBounds, right-aligned with visible bounds.
    Multilink.multilink( [ this.visibleBoundsProperty, options.rightPanels.boundsProperty ],
      ( visibleBounds, panelsBounds ) => {
        options.rightPanels.right = visibleBounds.right - FELConstants.SCREEN_VIEW_X_MARGIN;
        options.rightPanels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    // ResetAllButton in the right bottom corner of the visible bounds.
    Multilink.multilink( [ this.visibleBoundsProperty, this.resetAllButton.boundsProperty ],
      ( visibleBounds, resetAllButtonBounds ) => {
        this.resetAllButton.right = visibleBounds.maxX - FELConstants.SCREEN_VIEW_X_MARGIN;
        this.resetAllButton.bottom = visibleBounds.maxY - FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    // Developer accordion box at center-top of the visible bounds.
    Multilink.multilink( [ this.visibleBoundsProperty, options.developerAccordionBox.boundsProperty ],
      ( visibleBounds, developerAccordionBoxBounds ) => {
        options.developerAccordionBox.centerX = visibleBounds.centerX + FELConstants.SCREEN_VIEW_X_MARGIN;
        options.developerAccordionBox.top = visibleBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    // Time control at center bottom of the visible bounds.
    if ( options.timeControlNode ) {
      const timeControlNode = options.timeControlNode;
      Multilink.multilink( [ this.visibleBoundsProperty, timeControlNode.boundsProperty ],
        ( visibleBounds, timeControlNodeBounds ) => {
          timeControlNode.centerX = visibleBounds.centerX;
          timeControlNode.bottom = visibleBounds.bottom - FELConstants.SCREEN_VIEW_Y_MARGIN;
        } );
    }

    // Add vertical lines to show the range of x over which the gradient B-field extends.
    // See FELQueryParameters.gradientField and https://github.com/phetsims/faradays-electromagnetic-lab/issues/167.
    if ( FELQueryParameters.gradientField ) {
      const minX = FELConstants.GRADIENT_FIELD_X_RANGE.min;
      const maxX = FELConstants.GRADIENT_FIELD_X_RANGE.max;
      this.addChild( new Line( minX, this.layoutBounds.minY, minX, this.layoutBounds.maxY, { stroke: 'yellow' } ) );
      this.addChild( new Line( maxX, this.layoutBounds.minY, maxX, this.layoutBounds.maxY, { stroke: 'yellow' } ) );
    }
  }

  /**
   * Creates a dragBoundsProperty for scenarios that do not involve the 'Lock to Axis' feature.
   * This is relevant in the 'Bar Magnet' and 'Electromagnet' screens.
   *
   * Note that we are not concerned with optional leftPanels, which are the panels related to the Electromagnet.
   * It's possible to "lost" the compass behind these panels. But it's also possible to lose the compass behind
   * the faucet in the Generator screen, and the voltmeter in any screen that has one.  If the user loses the
   * compass, they can 'Reset All'.  For more discussion about this, see
   * https://github.com/phetsims/faradays-electromagnetic-lab/issues/163#issuecomment-2121174433
   */
  protected createDragBoundsProperty( panelsBoundsProperty: TReadOnlyProperty<Bounds2> ): TReadOnlyProperty<Bounds2> {
    return new DerivedProperty( [ panelsBoundsProperty ],
      panelsBounds => this.layoutBounds.withMaxX( panelsBounds.left ) );
  }

  /**
   * Configures a dragBoundsProperty for scenarios that involve a magnet and a pickup coil, and require the
   * 'Lock to Axis' feature. This is relevant in the 'Pickup Coil' and 'Transformer' screens.
   *
   * See notes above for createDragBoundsProperty, about why we're ignoring optional leftPanels. Those notes
   * apply here as well.
   */
  protected configureDragBoundsProperty(
    dragBoundsProperty: Property<Bounds2>,
    lockedToAxisProperty: TReadOnlyProperty<boolean>,
    panelsBoundsProperty: TReadOnlyProperty<Bounds2>,
    magnetPositionProperty: Property<Vector2>,
    pickupCoilPositionProperty: Property<Vector2>,
    magnetNode: BarMagnetNode | ElectromagnetNode,
    pickupCoilNode: PickupCoilNode
  ): void {
    Multilink.multilink( [ lockedToAxisProperty, panelsBoundsProperty ], ( lockToAxis, panelsBounds ) => {
      if ( lockToAxis ) {
        // Dragging is locked to 1D, horizontally along the pickup coil's axis.

        // Move the magnet and pickup coil a usable position, which we assume is their initial position. Do this only
        // when not setting state. When setting state, reset (and changing Property value in general) will be ignored,
        // and the assertion will fail.
        if ( !isSettingPhetioStateProperty.value ) {
          magnetPositionProperty.reset();
          pickupCoilPositionProperty.reset();
          assert && assert( magnetPositionProperty.value.y === pickupCoilPositionProperty.value.y,
            'Lock to Axis feature requires the magnet and pickup coil to have the same y coordinate: ' +
            `magnet.y=${magnetPositionProperty.value.y} !== pickupCoil.y=${pickupCoilPositionProperty.value.y}` );
        }
        const y = pickupCoilPositionProperty.value.y;

        // Constrain to horizontal dragging.
        dragBoundsProperty.value = new Bounds2( this.layoutBounds.left, y, panelsBounds.left, y );

        // Change the cursors to indicate that drag direction is constrained to horizontal.
        magnetNode.cursor = 'ew-resize';
        if ( magnetNode instanceof ElectromagnetNode ) {
          magnetNode.backgroundNode.cursor = 'ew-resize';
        }
        pickupCoilNode.cursor = 'ew-resize';
        pickupCoilNode.backgroundNode.cursor = 'ew-resize';
      }
      else {
        // Dragging is 2D, horizontal and vertical.

        // Restore drag bounds.
        dragBoundsProperty.value = this.layoutBounds.withMaxX( panelsBounds.left );

        // Restore cursors.
        magnetNode.cursor = 'pointer';
        if ( magnetNode instanceof ElectromagnetNode ) {
          magnetNode.backgroundNode.cursor = 'pointer';
        }
        pickupCoilNode.cursor = 'pointer';
        pickupCoilNode.backgroundNode.cursor = 'pointer';
      }
    } );
  }
}

faradaysElectromagneticLab.register( 'FELScreenView', FELScreenView );