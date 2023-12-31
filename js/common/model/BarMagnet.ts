// Copyright 2023, University of Colorado Boulder

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
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = EmptySelfOptions;

export type BarMagnetOptions = SelfOptions & MagnetOptions;


export default class BarMagnet extends Magnet {

  // A writeable version of this.strengthProperty: TReadOnlyProperty<number>
  public readonly barMagnetStrengthProperty: Property<number>;

  public readonly size: Dimension2; // unitless, width is from the magnet's South to North pole

  public constructor( providedOptions: BarMagnetOptions ) {

    const strengthProperty = new NumberProperty( 225, {
      units: 'G',
      range: new Range( 0, 300 ),
      tandem: providedOptions.tandem.createTandem( 'strengthProperty' ),
      phetioFeatured: true
    } );

    super( strengthProperty, strengthProperty.range, providedOptions );

    this.barMagnetStrengthProperty = strengthProperty;
    this.size = new Dimension2( 250, 50 );
  }

  /**
   * Gets the B-field vector at a point in the magnet's local 2D coordinate frame.
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
   * Gets the B-field x component for a position relative to the magnet's origin.
   * This component is identical in all 4 quadrants.
   */
  private getBx( x: number, y: number ): number {
    return this.chooseGrid( x, y ).getBx( x, y );
  }

  /**
   * Gets the B-field y component for a position relative to the magnet's origin.
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
   * Chooses the appropriate grid of precomputed B-field data.
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