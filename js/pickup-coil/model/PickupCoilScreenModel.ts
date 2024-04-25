// Copyright 2023-2024, University of Colorado Boulder

/**
 * PickupCoilScreenModel is the top-level model for the 'Pickup Coil' screen.
 *
 * Note that this class name differs from the PhET convention of {ScreenName}Model to avoid confusion between
 * the 'Pickup Coil' screen and the PickupCoil model element.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BarMagnet from '../../common/model/BarMagnet.js';
import KinematicCompass from '../../common/model/KinematicCompass.js';
import FELScreenModel from '../../common/model/FELScreenModel.js';
import FELPreferences from '../../common/model/FELPreferences.js';

// y position shared by all components, so that they are on the same horizontal axis.
const Y_POSITION = 375;

// Positions are factored out here because we've changed them so many times.
const BAR_MAGNET_POSITION = new Vector2( 200, Y_POSITION );
const PICKUP_COIL_POSITION = new Vector2( 500, Y_POSITION );
const COMPASS_POSITION = new Vector2( 635, Y_POSITION );

assert && assert( BAR_MAGNET_POSITION.y === PICKUP_COIL_POSITION.y,
  'Bar magnet and pickup coil must have the same initial y coordinate for the Lock to Axis feature.' );

export default class PickupCoilScreenModel extends FELScreenModel {

  public readonly barMagnet: BarMagnet;
  public readonly pickupCoil: PickupCoil;

  public constructor( preferences: FELPreferences, tandem: Tandem ) {

    const barMagnet = new BarMagnet( {
      position: BAR_MAGNET_POSITION,
      tandem: tandem.createTandem( 'barMagnet' )
    } );

    super( barMagnet, preferences.magneticUnitsProperty, {
      createCompass: ( magnet, isPlayingProperty, tandem ) => new KinematicCompass( magnet, isPlayingProperty, {
        position: COMPASS_POSITION,
        visible: false,
        tandem: tandem
      } ),
      isPlayingPropertyOptions: {
        tandem: Tandem.OPT_OUT // because this screen has no time controls
      },
      tandem: tandem
    } );

    this.barMagnet = barMagnet;

    this.pickupCoil = new PickupCoil( barMagnet, preferences.currentFlowProperty, {
      position: PICKUP_COIL_POSITION,
      maxEMF: 8000000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 0.77, // see PickupCoil.transitionSmoothingScaleProperty

      // To avoid inducing significant (incorrect) EMF when the magnet is moved vertically when inside the coil,
      // use sample-point spacing that results (approximately) in the same number of sample points always being
      // "inside" the magnet. See https://phet.unfuddle.com/a#/projects/9404/tickets/by_number/248.
      samplePointsSpacing: barMagnet.size.height / 10,
      coilOptions: {
        currentSpeedScale: 3
      },
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    this.clock.addListener( dt => this.pickupCoil.step( dt ) );

    assert && this.isPlayingProperty.link(
      isPlaying => assert && assert( isPlaying, 'isPlaying must always be true for the Pickup Coil screen.' ) );
  }

  public override reset(): void {
    super.reset();
    this.barMagnet.reset();
    this.pickupCoil.reset();
  }
}

faradaysElectromagneticLab.register( 'PickupCoilScreenModel', PickupCoilScreenModel );