// Copyright 2023-2024, University of Colorado Boulder

/**
 * Generator is the model of a simple generator. Motion-based power is provided by a turbine, which is rotated by
 * water flow. That rotation caused modulation of a magnetic field, which induces current in a pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Turbine from './Turbine.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { FixedNumberOfSamplePointsStrategy } from '../../common/model/PickupCoilSamplePointsStrategy.js';
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class Generator extends PhetioObject {

  public readonly turbine: Turbine;
  public readonly pickupCoil: PickupCoil;

  public constructor( tandem: Tandem ) {

    super( {
      isDisposable: false,
      tandem: tandem,
      phetioState: false
    } );

    this.turbine = new Turbine( tandem.createTandem( 'turbine' ) );

    this.pickupCoil = new PickupCoil( this.turbine.barMagnet, {
      position: new Vector2( 500, 400 ),
      positionPropertyOptions: {
        phetioReadOnly: true
      },
      lightBulbOptions: {
        lightsWhenCurrentChangesDirection: false
      },
      maxEMF: 26000, // see PickupCoil.calibrateMaxEMF
      transitionSmoothingScale: 1, // see PickupCoil.transitionSmoothingScaleProperty
      samplePointsStrategy: new FixedNumberOfSamplePointsStrategy( 9 /* numberOfSamplePoints */ ),
      tandem: tandem.createTandem( 'pickupCoil' )
    } );

    // Apply drag to the turbine based on the characteristics of the pickup coil.
    // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/11
    const numberOfLoopsRange = this.pickupCoil.coil.numberOfLoopsProperty.range;
    const loopRadiusRange = this.pickupCoil.coil.loopRadiusRange;
    const maxArea = numberOfLoopsRange.max * Math.PI * loopRadiusRange.max * loopRadiusRange.max;
    const minArea = numberOfLoopsRange.min * Math.PI * loopRadiusRange.min * loopRadiusRange.min;
    const maxDragFactor = this.turbine.dragFactorProperty.range.max;
    const minDragFactor = ( minArea / maxArea ) * maxDragFactor; // non-zero loop area must have non-zero drag factor
    Multilink.multilink(
      [ this.pickupCoil.coil.numberOfLoopsProperty, this.pickupCoil.coil.loopRadiusProperty, this.turbine.barMagnet.strengthPercentProperty ],
      ( numberOfLoops, loopRadius, magnetStrengthPercent ) => {
        const area = numberOfLoops * Math.PI * loopRadius * loopRadius;
        this.turbine.dragFactorProperty.value =
          ( magnetStrengthPercent / 100 ) * Utils.linear( minArea, maxArea, minDragFactor, maxDragFactor, area );
      } );
  }

  public reset(): void {
    this.turbine.reset();
    this.pickupCoil.reset();
  }

  public step( dt: number ): void {
    this.turbine.step( dt );
    this.pickupCoil.step( dt );
  }
}
faradaysElectromagneticLab.register( 'Generator', Generator );