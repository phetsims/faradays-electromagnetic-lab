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

    this.compassNode = new CompassNode( options.compass, options.tandem.createTandem( 'compassNode' ) );

    this.fieldMeterNode = new FieldMeterNode( options.fieldMeter, options.tandem.createTandem( 'fieldMeterNode' ) );

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
}

faradaysElectromagneticLab.register( 'FELScreenView', FELScreenView );