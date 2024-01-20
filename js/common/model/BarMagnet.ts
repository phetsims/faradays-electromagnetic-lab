// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnet is the model of a bar magnet. It uses a precomputed B-field that was generated using MathCAD, and is
 * described in detail in BarMagnetFieldGrid.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet, { MagnetOptions } from './Magnet.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import BarMagnetFieldData from './BarMagnetFieldData.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import BarMagnetFieldGrid from './BarMagnetFieldGrid.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import WithOptional from '../../../../phet-core/js/types/WithOptional.js';

const DEFAULT_SIZE = new Dimension2( 250, 50 );
const MAX_STRENGTH = 300; // G
const STRENGTH_PERCENT_RANGE = new Range( 0, 100 ); // %
const STRENGTH_RANGE = new Range( ( STRENGTH_PERCENT_RANGE.min / 100 ) * MAX_STRENGTH, ( STRENGTH_PERCENT_RANGE.max / 100 ) * MAX_STRENGTH ); // G

type SelfOptions = EmptySelfOptions;

export type BarMagnetOptions = SelfOptions & WithOptional<MagnetOptions, 'size'>;

export default class BarMagnet extends Magnet {

  // Strength as a percentage
  public readonly strengthPercentProperty: NumberProperty;

  public constructor( providedOptions: BarMagnetOptions ) {

    const options = optionize<BarMagnetOptions, SelfOptions, MagnetOptions>()( {

      // MagnetOptions
      size: DEFAULT_SIZE
    }, providedOptions );

    const strengthPercentProperty = new NumberProperty( 75, {
      units: '%',
      range: STRENGTH_PERCENT_RANGE,
      tandem: options.tandem.createTandem( 'strengthPercentProperty' ),
      phetioFeatured: true
    } );

    const strengthProperty = new DerivedProperty( [ strengthPercentProperty ],
      strengthPercent => ( strengthPercent / 100 ) * MAX_STRENGTH, {
        isValidValue: strength => STRENGTH_RANGE.contains( strength ),
        units: 'G',
        tandem: options.tandem.createTandem( 'strengthProperty' ),
        phetioValueType: NumberIO,
        phetioFeatured: true,
        phetioDocumentation: 'To change strength, use strengthPercentProperty.'
      } );

    const strengthRange = new Range( ( STRENGTH_PERCENT_RANGE.min / 100 ) * MAX_STRENGTH, ( STRENGTH_PERCENT_RANGE.max / 100 ) * MAX_STRENGTH );

    super( strengthProperty, strengthRange, options );

    this.strengthPercentProperty = strengthPercentProperty;
  }

  /**
   * Gets the B-field vector at a point in the magnet's local 2D coordinate frame.
   *
   * @param position - in the magnet's local coordinate frame
   * @param outputVector - result is written to this vector
   */
  protected override getLocalFieldVector( position: Vector2, outputVector: Vector2 ): Vector2 {

    // Compute the B-field components by interpolating over precomputed B-field data.
    const x = this.getBx( position.x, position.y );
    const y = this.getBy( position.x, position.y );
    outputVector.setXY( x, y );

    // Scale the B-field to match the bar magnet's strength.
    outputVector.multiplyScalar( this.strengthProperty.value / BarMagnetFieldData.MAGNET_STRENGTH );

    return outputVector;
  }

  /**
   * Gets the B-field x component for a position in the magnet's locale coordinate frame.
   * This component is identical in all 4 quadrants.
   */
  private getBx( x: number, y: number ): number {
    return this.chooseGrid( x, y ).getBx( x, y );
  }

  /**
   * Gets the B-field y component for a position in magnet's locale coordinate frame.
   * This component is the same in 2 quadrants, but must be reflected about the y-axis for 2 quadrants.
   */
  private getBy( x: number, y: number ): number {
    let by = this.chooseGrid( x, y ).getBy( x, y );
    if ( ( x > 0 && y < 0 ) || ( x < 0 && y > 0 ) ) {
      by *= -1; // reflect about the y-axis
    }
    return by;
  }

  /**
   * Chooses the appropriate grid of precomputed B-field data, for a position in the magnet's locale coordinate frame.
   */
  private chooseGrid( x: number, y: number ): BarMagnetFieldGrid {

    // Data is precomputed only for the quadrant where x & y are positive, so use absolute values.
    const absX = Math.abs( x );
    const absY = Math.abs( y );

    let grid: BarMagnetFieldGrid;
    if ( BarMagnetFieldGrid.INTERNAL.contains( absX, absY ) ) {
      grid = BarMagnetFieldGrid.INTERNAL;
    }
    else if ( BarMagnetFieldGrid.EXTERNAL_NEAR.contains( absX, absY ) ) {
      grid = BarMagnetFieldGrid.EXTERNAL_NEAR;
    }
    else {
      grid = BarMagnetFieldGrid.EXTERNAL_FAR;
    }
    return grid;
  }
}

faradaysElectromagneticLab.register( 'BarMagnet', BarMagnet );