// Copyright 2023, University of Colorado Boulder

/**
 * BarMagnet is the model of a bar magnet.
 *
 * TODO: Add BarMagnet.java documentation
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Magnet from './Magnet.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import BFieldData from './BFieldData.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class BarMagnet extends Magnet {

  public readonly size: Dimension2; // width is from north to south pole

  // Precomputed B-fields
  private readonly internalGrid: BFieldGrid; // internal to the magnet
  private readonly externalNearGrid: BFieldGrid; // near the magnet
  private readonly externalFarGrid: BFieldGrid; // far from the magnet

  public constructor( tandem: Tandem ) {

    super( {
      strengthRange: new RangeWithValue( 0, 300, 225 ),
      tandem: tandem
    } );

    this.size = new Dimension2( 250, 50 );

    this.internalGrid = new BFieldGrid( BFieldData.BX_INTERNAL, BFieldData.BY_INTERNAL, BFieldData.INTERNAL_GRID_SIZE, BFieldData.INTERNAL_GRID_SPACING );
    this.externalNearGrid = new BFieldGrid( BFieldData.BX_EXTERNAL_NEAR, BFieldData.BY_EXTERNAL_NEAR, BFieldData.EXTERNAL_NEAR_GRID_SIZE, BFieldData.EXTERNAL_NEAR_GRID_SPACING );
    this.externalFarGrid = new BFieldGrid( BFieldData.BX_EXTERNAL_FAR, BFieldData.BY_EXTERNAL_FAR, BFieldData.EXTERNAL_FAR_GRID_SIZE, BFieldData.EXTERNAL_FAR_GRID_SPACING );
  }

  /**
   * Gets the B-field vector at a point in the magnet's local 2D coordinate frame.
   */
  protected getBFieldRelative( p: Vector2, outputVector: Vector2 ): Vector2 {

    // find B-field by interpolating grid points
    const x = this.getBx( p.x, p.y );
    const y = this.getBy( p.x, p.y );
    outputVector.setXY( x, y );

    // scale based on magnet strength
    outputVector.times( this.strengthProperty.value / BFieldData.GRID_MAGNET_STRENGTH );

    return outputVector;
  }

  /**
   * Gets the B-field x component for a point relative to the magnet's origin.
   * This component is identical in all 4 quadrants.
   */
  private getBx( x: number, y: number ): number {
    const grid: BFieldGrid = this.chooseGrid( x, y );
    return this.interpolate( Math.abs( x ), Math.abs( y ), grid.getMaxX(), grid.getMaxY(), grid.bxArray, grid.spacing );
  }

  /**
   * Gets the B-field y component for a point relative to the magnet's origin.
   * This component is the same in 2 quadrants, but must be reflected about the y-axis for 2 quadrants.
   */
  private getBy( x: number, y: number ): number {
    const grid: BFieldGrid = this.chooseGrid( x, y );
    let by = this.interpolate( Math.abs( x ), Math.abs( y ), grid.getMaxX(), grid.getMaxY(), grid.byArray, grid.spacing );
    if ( ( x > 0 && y < 0 ) || ( x < 0 && y > 0 ) ) {
      by *= -1; // reflect about the y-axis
    }
    return by;
  }

  /**
   * Chooses the appropriate grid.
   */
  private chooseGrid( x: number, y: number ): BFieldGrid {
    let grid: BFieldGrid;
    if ( this.internalGrid.contains( x, y ) ) {
      grid = this.internalGrid;
    }
    else if ( this.externalNearGrid.contains( x, y ) ) {
      grid = this.externalNearGrid;
    }
    else {
      grid = this.externalFarGrid;
    }
    return grid;
  }

  /**
   * Locates the 4 grid points that form a rectangle enclosing the specified point.
   * Then performs a linear interpolation of the B-field component at those 4 points.
   * Variable names in this method corresponds to those used in Mike Dubson's documentation, ie:
   *
   * f00-----------f10
   *  |             |
   *  |      xy     |
   *  |             |
   * f01-----------f11
   */
  private interpolate( x: number, y: number, maxX: number, maxY: number, componentValues: number[][], gridSpacing: number ): number {
    assert && assert( x >= 0 && y >= 0, 'x and y must be positive' ); // ...because our grid data is for that quadrant

    let value = 0; // B-field outside the grid is zero
    if ( x >= 0 && x <= maxX && y >= 0 && y <= maxY ) {

      // compute array indices
      let columnIndex = Math.floor( x / gridSpacing ); //TODO These were (int) casts in Java. Is Math.floor correct?
      let rowIndex = Math.floor( y / gridSpacing );

      /*
      * If we're at one of the index maximums, then we're exactly on the outer edge of the grid.
      * Back up by 1 so that we'll have a bounding rectangle.
      */
      if ( columnIndex === componentValues.length - 1 ) {
        columnIndex -= 1;
      }
      if ( rowIndex === componentValues[ 0 ].length - 1 ) {
        rowIndex -= 1;
      }

      // xy coordinates that define the enclosing rectangle
      const x0 = columnIndex * gridSpacing;
      const x1 = x0 + gridSpacing;
      const y0 = rowIndex * gridSpacing;
      const y1 = y0 + gridSpacing;

      // values at the 4 corners of the enclosing rectangle
      const f00 = componentValues[ columnIndex ][ rowIndex ];
      const f10 = componentValues[ columnIndex + 1 ][ rowIndex ];
      const f01 = componentValues[ columnIndex ][ rowIndex + 1 ];
      const f11 = componentValues[ columnIndex + 1 ][ rowIndex + 1 ];

      // interpolate
      value = ( f00 * ( ( x1 - x ) / ( x1 - x0 ) ) * ( ( y1 - y ) / ( y1 - y0 ) ) ) +
              ( f10 * ( ( x - x0 ) / ( x1 - x0 ) ) * ( ( y1 - y ) / ( y1 - y0 ) ) ) +
              ( f01 * ( ( x1 - x ) / ( x1 - x0 ) ) * ( ( y - y0 ) / ( y1 - y0 ) ) ) +
              ( f11 * ( ( x - x0 ) / ( x1 - x0 ) ) * ( ( y - y0 ) / ( y1 - y0 ) ) );
    }
    return value;
  }
}

/**
 * BFieldGrid is a grid of B-field vectors.
 * The vector components (Bx, By) are stored in separate arrays of arrays.
 * The arrays are in column-major order. This means that the x coordinate changes more slowly than the y coordinate.
 */
class BFieldGrid {

  public readonly bxArray: number[][];
  public readonly byArray: number[][];
  public readonly size: Dimension2;
  public readonly spacing: number;

  public constructor( bxArray: number[][], byArray: number[][], size: Dimension2, spacing: number ) {
    this.bxArray = bxArray;
    this.byArray = byArray;
    this.size = size;
    this.spacing = spacing;
  }

  /**
   * Determines if this grid contains the specified point.
   * Since the grid consists describes one quadrant of the space (where x & y are positive),
   * this is determined based on the absolute value of the x,y coordinates.
   */
  public contains( x: number, y: number ): boolean {
    const absX = Math.abs( x );
    const absY = Math.abs( y );
    return ( absX >= 0 && absX <= this.getMaxX() && absY >= 0 && absY <= this.getMaxY() );
  }

  public getMaxX(): number {
    return this.spacing * ( this.size.width - 1 );
  }

  public getMaxY(): number {
    return this.spacing * ( this.size.height - 1 );
  }
}

faradaysElectromagneticLab.register( 'BarMagnet', BarMagnet );