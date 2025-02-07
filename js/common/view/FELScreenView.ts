// Copyright 2024, University of Colorado Boulder

/**
 * FELScreenView is the base class for all ScreenViews in this sim.  It creates the UI elements that are common to
 * all screens, and handles layout that is common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import Property from '../../../../axon/js/Property.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ScreenView, { ScreenViewOptions } from '../../../../joist/js/ScreenView.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import isSettingPhetioStateProperty from '../../../../tandem/js/isSettingPhetioStateProperty.js';
import FELConstants from '../../common/FELConstants.js';
import CompassNode from '../../common/view/CompassNode.js';
import FieldMeterNode from '../../common/view/FieldMeterNode.js';
import FieldNode from '../../common/view/FieldNode.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELQueryParameters from '../FELQueryParameters.js';
import Compass from '../model/Compass.js';
import FieldMeter from '../model/FieldMeter.js';
import Magnet from '../model/Magnet.js';
import PickupCoil from '../model/PickupCoil.js';
import FELDeveloperAccordionBox from './FELDeveloperAccordionBox.js';
import PickupCoilDebuggerPanel from './PickupCoilDebuggerPanel.js';

type SelfOptions = {

  // Required UI components that are common to all screens.
  magnet: Magnet;
  compass: Compass;
  fieldMeter: FieldMeter;

  // Panels on the right side of the screen.
  // It is the subclass' responsibility to add these to the scene graph and pdomOrder.
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

    const options = optionize<FELScreenViewOptions, SelfOptions, ScreenViewOptions>()( {

      // SelfOptions
      timeControlNode: null,

      // ScreenViewOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    // Right panels top-aligned with layoutBounds, right-aligned with visible bounds.
    // Do this before creating compassNode so that compassNode will have valid dragBoundsProperty.
    // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/183.
    Multilink.multilink( [ this.visibleBoundsProperty, options.rightPanels.boundsProperty ],
      ( visibleBounds, rightPanelsBounds ) => {
        options.rightPanels.right = visibleBounds.right - FELConstants.SCREEN_VIEW_X_MARGIN;
        options.rightPanels.top = this.layoutBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );

    this.fieldNode = new FieldNode( options.magnet, this.visibleBoundsProperty, options.tandem.createTandem( 'fieldNode' ) );

    this.compassNode = new CompassNode( options.compass, {

      // To prevent compass from being occluded by right panels.
      dragBoundsProperty: new DerivedProperty( [ this.visibleBoundsProperty, options.rightPanels.boundsProperty ],
        ( visibleBounds, rightPanelsBounds ) => visibleBounds.withMaxX( rightPanelsBounds.left ) ),
      tandem: options.tandem.createTandem( 'compassNode' )
    } );

    this.fieldMeterNode = new FieldMeterNode( options.fieldMeter, {

      // Anywhere in the visible bounds. OK if it overlaps panels because it's intended to be in the foreground.
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
    options.rightPanels.maxHeight = this.layoutBounds.height - this.resetAllButton.height - ( 2 * FELConstants.SCREEN_VIEW_Y_MARGIN ) - 5;

    // ResetAllButton in the right bottom corner of the visible bounds.
    Multilink.multilink( [ this.visibleBoundsProperty, this.resetAllButton.boundsProperty ],
      ( visibleBounds, resetAllButtonBounds ) => {
        this.resetAllButton.right = visibleBounds.maxX - FELConstants.SCREEN_VIEW_X_MARGIN;
        this.resetAllButton.bottom = visibleBounds.maxY - FELConstants.SCREEN_VIEW_Y_MARGIN;
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
   * Adds an accordion box with developer controls, positioned at the top-center of the visible bounds.
   */
  protected addDeveloperAccordionBox( accordionBox: FELDeveloperAccordionBox ): void {
    Multilink.multilink( [ this.visibleBoundsProperty, accordionBox.boundsProperty ],
      ( visibleBounds, developerAccordionBoxBounds ) => {
        accordionBox.centerX = visibleBounds.centerX + FELConstants.SCREEN_VIEW_X_MARGIN;
        accordionBox.top = visibleBounds.top + FELConstants.SCREEN_VIEW_Y_MARGIN;
      } );
    this.addChild( accordionBox );
  }

  /**
   * Adds a panel that displays debugging info related to the pickup coil, positioned at the bottom-left of the layout bounds.
   */
  protected addPickupCoilDebuggerPanel( pickupCoil: PickupCoil ): void {
    const pickupCoilDebuggerPanel = new PickupCoilDebuggerPanel( pickupCoil, {
      left: this.layoutBounds.left + FELConstants.SCREEN_VIEW_X_MARGIN,
      bottom: this.layoutBounds.bottom - FELConstants.SCREEN_VIEW_Y_MARGIN
    } );
    this.addChild( pickupCoilDebuggerPanel );
  }

  /**
   * Creates a dragBoundsProperty for scenarios that do not involve the 'Lock to Axis' feature.
   * This is relevant in the 'Bar Magnet' and 'Electromagnet' screens.
   */
  protected static createDragBoundsProperty( rightPanelsBoundsProperty: TReadOnlyProperty<Bounds2>, layoutBounds: Bounds2 ): TReadOnlyProperty<Bounds2> {
    return new DerivedProperty( [ rightPanelsBoundsProperty ], rightPanelsBounds => layoutBounds.withMaxX( rightPanelsBounds.left ), {
      valueComparisonStrategy: 'equalsFunction'
    } );
  }

  /**
   * Creates a dragBoundsProperty for scenarios that involve the 'Lock to Axis' feature.
   * This is relevant in the 'Pickup Coil' and 'Transformer' screens.
   */
  protected static createDragBoundsPropertyForLockToAxis(
    lockToAxisProperty: TReadOnlyProperty<boolean>,
    layoutBounds: Bounds2,
    panelsBoundsProperty: TReadOnlyProperty<Bounds2>,
    pickupCoilPositionProperty: Property<Vector2>
  ): TReadOnlyProperty<Bounds2> {

    const dragBoundsProperty = new Property( layoutBounds, {
      valueComparisonStrategy: 'equalsFunction'
    } );

    Multilink.multilink( [ lockToAxisProperty, panelsBoundsProperty, pickupCoilPositionProperty ],
      ( lockToAxis, panelsBounds, pickupCoilPosition ) => {
        if ( lockToAxis ) {

          // Dragging is 1D, constrained to horizontal dragging along the pickup coil's axis.
          dragBoundsProperty.value = new Bounds2( layoutBounds.left, pickupCoilPosition.y, panelsBounds.left, pickupCoilPosition.y );
        }
        else {

          // Dragging is 2D, horizontal and vertical. Restore drag bounds.
          dragBoundsProperty.value = layoutBounds.withMaxX( panelsBounds.left );
        }
      } );

    return dragBoundsProperty;
  }

  /**
   * A listener for lockToAxisProperty that moves the magnet and pickup coil to their locked positions.
   */
  public static lockToAxisListener( lockToAxis: boolean,
                                    magnetPositionProperty: Property<Vector2>,
                                    pickupCoilPositionProperty: Property<Vector2> ): void {
    if ( lockToAxis ) {

      // Dragging is locked to 1D, horizontally along the pickup coil's axis.
      // Move the magnet and pickup coil to a usable position, which we assume is their initial position. Do this only
      // when not setting state. When setting state, reset (and changing Property value in general) will be ignored,
      // and the assertion will fail.
      if ( !isSettingPhetioStateProperty.value ) {
        magnetPositionProperty.reset();
        pickupCoilPositionProperty.reset();
        assert && assert( magnetPositionProperty.value.y === pickupCoilPositionProperty.value.y,
          'Lock to Axis feature requires the magnet and pickup coil to have the same y coordinate: ' +
          `magnet.y=${magnetPositionProperty.value.y} !== pickupCoil.y=${pickupCoilPositionProperty.value.y}` );
      }
    }
  }
}

faradaysElectromagneticLab.register( 'FELScreenView', FELScreenView );