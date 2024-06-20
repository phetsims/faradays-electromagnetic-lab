// Copyright 2023-2024, University of Colorado Boulder

/**
 * Generator is the model of a simple generator. Motion-based power is provided by a turbine, which is rotated by
 * water flow. The rotation causes modulation of a magnetic field, which induces EMF in a pickup coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import PhetioObject, { PhetioObjectOptions } from '../../../../tandem/js/PhetioObject.js';
import Turbine from './Turbine.js';
import PickupCoil from '../../common/model/PickupCoil.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Utils from '../../../../dot/js/Utils.js';
import Multilink from '../../../../axon/js/Multilink.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize from '../../../../phet-core/js/optionize.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { CurrentFlow } from '../../common/FELQueryParameters.js';

type SelfOptions = {
  turbinePosition: Vector2;
  pickupCoilPosition: Vector2;
};

type GeneratorOptions = SelfOptions & PickRequired<PhetioObjectOptions, 'tandem'>;

export default class Generator extends PhetioObject {

  public readonly turbine: Turbine;
  public readonly pickupCoil: PickupCoil;

  public constructor( currentFlowProperty: TReadOnlyProperty<CurrentFlow>, providedOptions: GeneratorOptions ) {

    const options = optionize<GeneratorOptions, SelfOptions, PhetioObjectOptions>()( {
      isDisposable: false,
      phetioFeatured: true, // so that featured linked element will appear in 'Featured' tree
      phetioState: false
    }, providedOptions );

    super( options );

    this.turbine = new Turbine( options.turbinePosition, options.tandem.createTandem( 'turbine' ) );

    this.pickupCoil = new PickupCoil( this.turbine.barMagnet, currentFlowProperty, {
      position: options.pickupCoilPosition,
      positionPropertyOptions: {
        phetioReadOnly: true
      },
      lightBulbOptions: {

        // The turbine is cyclic, and current changes direction. We might 'step over' the zero points in the model,
        // so ensure that the light bulb will go through an 'off' state as the current direction changes.
        // See https://github.com/phetsims/faradays-electromagnetic-lab/issues/152.
        lightsWhenCurrentChangesDirectionProperty: new BooleanProperty( false )
      },
      voltmeterOptions: {

        // Disable voltmeter kinematics for the generator. Immediate response is needed, due to the cyclic nature.
        kinematicsEnabledProperty: new BooleanProperty( false )
      },
      maxEMF: 110000, // see PickupCoil.maxEMFProperty
      transitionSmoothingScale: 1, // see PickupCoil.transitionSmoothingScaleProperty
      samplePointsSpacing: this.turbine.barMagnet.size.height / 10, // similar to PickupCoilScreenModel
      fluxAreaCompensationEnabled: false, // see https://github.com/phetsims/faradays-electromagnetic-lab/issues/170
      tandem: options.tandem.createTandem( 'pickupCoil' )
    } );

    // Apply drag to the turbine based on the characteristics of the pickup coil. It would be preferred to have
    // dragFactorProperty derived in Turbine. But its derivation requires both PickupCoil and Turbine, and PickupCoil
    // instantiation requires Turbine, so we have circular dependencies. Responsibility for setting dragFactorProperty
    // therefore lives here in Generator. See https://github.com/phetsims/faradays-electromagnetic-lab/issues/11
    const numberOfLoopsRange = this.pickupCoil.coil.numberOfLoopsProperty.range;
    const loopAreaRange = this.pickupCoil.coil.loopAreaRange;
    const minArea = numberOfLoopsRange.min * loopAreaRange.min;
    const maxArea = numberOfLoopsRange.max * loopAreaRange.max;
    const maxDragFactor = this.turbine.dragFactorProperty.range.max;
    const minDragFactor = ( minArea / maxArea ) * maxDragFactor; // non-zero loop area must have non-zero drag factor
    Multilink.multilink(
      [ this.pickupCoil.coil.numberOfLoopsProperty, this.pickupCoil.coil.loopAreaProperty, this.turbine.barMagnet.strengthPercentProperty ],
      ( numberOfLoops, loopArea, magnetStrengthPercent ) => {
        const A = numberOfLoops * loopArea;
        this.turbine.dragFactorProperty.value =
          ( magnetStrengthPercent / 100 ) * Utils.linear( minArea, maxArea, minDragFactor, maxDragFactor, A );
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