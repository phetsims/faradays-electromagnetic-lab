// Copyright 2023-2024, University of Colorado Boulder

/**
 * BarMagnetFieldGrid is a grid of precomputed B-field values for BarMagnet. This was ported from the Java version of
 * the simulation, and was motivated by a 2010 user report in https://phet.unfuddle.com/a#/projects/9404/tickets/by_number/2236.
 * This code originally lived in BarMagnet.java, but made sense to encapsulate here.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 *
 * Adapted from BarMagnet.java:
 *
 * It was not feasible to implement a numerical model of a magnet's B-field directly in Java, as it relies on double
 * integrals. So the model was implemented in MathCAD as a horizontal cylinder, and MathCAD was used to create 3 grids
 * of B-field vectors. The MathCAD model can be found in .xmcd (MathCAD) and .pdf formats at
 * doc/java-version/bFieldOfHorizCylinderNumerical.*
 *
 * The 3 B-field grids are:
 * - internal: field internal to the magnet
 * - external-near: field near the magnet
 * - external-far: field far from the magnet
 *
 * In order to model the discontinuity that appears at the top and bottom magnet edges, internal and external-near have
 * points that lie exactly on those edges, and have different values for those points.
 *
 * The external-far grid is a sparse grid, and provides an approximate B-field for use by the compass.
 *
 * The 3 grids overlap such that external-near contains internal, and external-far contains external-near.
 *
 * Our coordinate system has +x to the left, and +y down, with quadrants numbered like this:
 *
 * Q3 | Q2
 * -------
 * Q4 | Q1
 *
 * Each grid assumes that the magnet's center is at the origin (0,0), and includes values only for Q1, the quadrant
 * where x and y are both positive.
 *
 * BarMagnetFieldData.ts stores each grid as 2 arrays: one for Bx, one for By. Values are in column-major order
 * (the x coordinate changes more slowly than the y coordinate.) x and y coordinates both start at 0.
 *
 * The simulation reads the arrays, and computes the B-field at a specified point using a bilinear linear interpolation
 * algorithm - see method BarMagnetFieldGrid.interpolate. After locating a B-field vector in Q1, here's how to map it
 * to one of the other quadrants:
 *
 * Q2: reflect about the x-axis, so multiply by -1
 * Q3: reflect through the origin, so no change
 * Q4: reflect about the x-axis and reflect through the origin, so multiply by -1
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import BarMagnetFieldData from './BarMagnetFieldData.js';

export default class BarMagnetFieldGrid {

  // name used for debugging purposes
  private readonly debugName: string;

  // B-field vector x & y components, generated using MathCAD
  private readonly bxArray: number[][];
  private readonly byArray: number[][];

  // number of points in the grid, used MathCAD for generating the grid data
  private readonly size: Dimension2;

  // spacing between points in the grid, the same in both dimensions, used in MathCAD for generating the grid data
  private readonly spacing: number;

  private readonly maxX: number;
  private readonly maxY: number;

  // These are the 3 grids that were generated using MathCAD.
  public static readonly INTERNAL = new BarMagnetFieldGrid( 'INTERNAL', BarMagnetFieldData.BX_INTERNAL, BarMagnetFieldData.BY_INTERNAL, BarMagnetFieldData.INTERNAL_GRID_SIZE, BarMagnetFieldData.INTERNAL_GRID_SPACING );
  public static readonly EXTERNAL_NEAR = new BarMagnetFieldGrid( 'EXTERNAL_NEAR', BarMagnetFieldData.BX_EXTERNAL_NEAR, BarMagnetFieldData.BY_EXTERNAL_NEAR, BarMagnetFieldData.EXTERNAL_NEAR_GRID_SIZE, BarMagnetFieldData.EXTERNAL_NEAR_GRID_SPACING );
  public static readonly EXTERNAL_FAR = new BarMagnetFieldGrid( 'EXTERNAL_FAR', BarMagnetFieldData.BX_EXTERNAL_FAR, BarMagnetFieldData.BY_EXTERNAL_FAR, BarMagnetFieldData.EXTERNAL_FAR_GRID_SIZE, BarMagnetFieldData.EXTERNAL_FAR_GRID_SPACING );

  /**
   * Constructor is private because the static instances above are the only instances that should exist.
   */
  private constructor( debugName: string, bxArray: number[][], byArray: number[][], size: Dimension2, spacing: number ) {

    assert && assert( bxArray.length === size.width, `${debugName}: unexpect bxArray.length: ${bxArray.length}` );
    assert && assert( _.every( bxArray, array => array.length === size.height ), `${debugName}: bxArray has inconsistent number of components` );
    assert && assert( _.every( bxArray, array => _.every( array, value => ( Math.abs( value ) <= BarMagnetFieldData.MAGNET_STRENGTH ) ) ),
      `${debugName}: bxArray contains invalid values` );

    assert && assert( byArray.length === size.width, `${debugName}: unexpect byArray.length: ${byArray.length}` );
    assert && assert( _.every( byArray, array => array.length === size.height ), `${debugName}: byArray has inconsistent number of components` );
    assert && assert( _.every( byArray, array => _.every( array, value => ( Math.abs( value ) <= BarMagnetFieldData.MAGNET_STRENGTH ) ) ),
      `${debugName}: byArray contains invalid values` );

    assert && assert( size.width > 0 && size.height > 0, `${debugName}: invalid size: ${size}` );
    assert && assert( Number.isInteger( spacing ) && spacing > 0, `${debugName}: invalid spacing: ${spacing}` );

    this.debugName = debugName;
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
   * Gets Bx, the x component of the field vector, at point (x,y).
   */
  public getBx( x: number, y: number ): number {
    return this.interpolate( Math.abs( x ), Math.abs( y ), this.bxArray );
  }

  /**
   * Gets By, the y component of the field vector, at point (x,y).
   */
  public getBy( x: number, y: number ): number {
    return this.interpolate( Math.abs( x ), Math.abs( y ), this.byArray );
  }

  /**
   * Locates the 4 grid points that form a rectangle enclosing the specified point.
   * Then performs a bilinear interpolation of the B-field component at those 4 points.
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
      let columnIndex = Math.floor( x / this.spacing );
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

      // Bilinear interpolation: a resampling method that computes a distance-weighted average of the four nearest values,
      // which in this case are the values at the 4 corners of the enclosing rectangle noted above: f00, f10, f01, f11.
      // Common terms have not been factored out so that this matches the form typically shown in references.
      value = ( f00 * ( ( x1 - x ) / ( x1 - x0 ) ) * ( ( y1 - y ) / ( y1 - y0 ) ) ) +
              ( f10 * ( ( x - x0 ) / ( x1 - x0 ) ) * ( ( y1 - y ) / ( y1 - y0 ) ) ) +
              ( f01 * ( ( x1 - x ) / ( x1 - x0 ) ) * ( ( y - y0 ) / ( y1 - y0 ) ) ) +
              ( f11 * ( ( x - x0 ) / ( x1 - x0 ) ) * ( ( y - y0 ) / ( y1 - y0 ) ) );
    }
    return value;
  }
}

faradaysElectromagneticLab.register( 'BarMagnetFieldGrid', BarMagnetFieldGrid );