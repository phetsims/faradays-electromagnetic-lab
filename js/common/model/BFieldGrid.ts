// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BFieldData from './BFieldData.js';

export default class BFieldGrid {

  // internal name, for debugging
  public readonly name: string;

  // B-field vector x & y components, generated using MathCAD
  public readonly bxArray: number[][];
  public readonly byArray: number[][];

  // number of points in the grid, used MathCAD for generating the grid data
  public readonly size: Dimension2;

  // spacing between points in the grid, the same in both dimensions, used in MathCAD for generating the grid data
  public readonly spacing: number;

  private readonly maxX: number;
  private readonly maxY: number;

  // These are the 3 grids that were generated using MathCAD.
  public static readonly INTERNAL = new BFieldGrid( 'INTERNAL', BFieldData.BX_INTERNAL, BFieldData.BY_INTERNAL, BFieldData.INTERNAL_GRID_SIZE, BFieldData.INTERNAL_GRID_SPACING );
  public static readonly EXTERNAL_NEAR = new BFieldGrid( 'EXTERNAL_NEAR', BFieldData.BX_EXTERNAL_NEAR, BFieldData.BY_EXTERNAL_NEAR, BFieldData.EXTERNAL_NEAR_GRID_SIZE, BFieldData.EXTERNAL_NEAR_GRID_SPACING );
  public static readonly EXTERNAL_FAR = new BFieldGrid( 'EXTERNAL_FAR', BFieldData.BX_EXTERNAL_FAR, BFieldData.BY_EXTERNAL_FAR, BFieldData.EXTERNAL_FAR_GRID_SIZE, BFieldData.EXTERNAL_FAR_GRID_SPACING );

  /**
   * Constructor is private because the static instances above are the only instances that should exist.
   */
  private constructor( name: string, bxArray: number[][], byArray: number[][], size: Dimension2, spacing: number ) {

    assert && assert( bxArray.length === size.width, `${name}: unexpect bxArray.length: ${bxArray.length}` );
    assert && assert( _.every( bxArray, array => array.length === size.height ), `${name}: bxArray has inconsistent number of components` );

    assert && assert( byArray.length === size.width, `${name}: unexpect byArray.length: ${byArray.length}` );
    assert && assert( _.every( byArray, array => array.length === size.height ), `${name}: byArray has inconsistent number of components` );

    assert && assert( size.width > 0 && size.height > 0, `${name}: invalid size: ${size}` );
    assert && assert( Number.isInteger( spacing ) && spacing > 0, `${name}: invalid spacing: ${spacing}` );

    this.name = name;
    this.bxArray = bxArray;
    this.byArray = byArray;
    this.size = size;
    this.spacing = spacing;

    this.maxX = this.spacing * ( this.size.width - 1 );
    this.maxY = this.spacing * ( this.size.height - 1 );
  }

  /**
   * Determines if this grid contains the specified point.
   * Since the grid consists describes one quadrant of the space (where x & y are positive),
   * this is determined based on the absolute value of the x,y coordinates.
   */
  public contains( x: number, y: number ): boolean {
    assert && assert( x >= 0 && y >= 0, 'x and y must be positive, because our grid data is for the quadrant where x & y are positive' );
    return ( x >= 0 && x <= this.maxX && y >= 0 && y <= this.maxY );
  }

  /**
   * Gets the B-field x component at point (x,y).
   */
  public getBx( x: number, y: number ): number {
    return this.interpolate( Math.abs( x ), Math.abs( y ), this.bxArray );
  }

  /**
   * Gets the B-field x component at point (x,y).
   */
  public getBy( x: number, y: number ): number {
    return this.interpolate( Math.abs( x ), Math.abs( y ), this.byArray );
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
  private interpolate( x: number, y: number, componentValues: number[][] ): number {
    assert && assert( x >= 0 && y >= 0, 'x and y must be positive, because our grid data is for the quadrant where x & y are positive' );

    let value = 0; // B-field outside the grid is zero
    if ( this.contains( x, y ) ) {

      // compute array indices
      let columnIndex = Math.floor( x / this.spacing ); //TODO These were (int) casts in Java. Is Math.floor correct?
      let rowIndex = Math.floor( y / this.spacing );

      // If we're at one of the index maximums, then we're exactly on the outer edge of the grid.
      // Back up by 1 so that we'll have a bounding rectangle.
      if ( columnIndex === componentValues.length - 1 ) {
        columnIndex -= 1;
      }
      if ( rowIndex === componentValues[ 0 ].length - 1 ) {
        rowIndex -= 1;
      }

      // xy coordinates that define the enclosing rectangle
      const x0 = columnIndex * this.spacing;
      const x1 = x0 + this.spacing;
      const y0 = rowIndex * this.spacing;
      const y1 = y0 + this.spacing;

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

faradaysElectromagneticLab.register( 'BFieldGrid', BFieldGrid );