// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, Node, Path } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CurrentSource from '../model/CurrentSource.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import ACPowerSupply from '../model/ACPowerSupply.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import ShadedRectangle, { ShadedRectangleOptions } from '../../../../scenery-phet/js/ShadedRectangle.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import FELColors from '../FELColors.js';

const BODY_BOUNDS = new Bounds2( 0, 0, 230, 210 );
const CORNER_RADIUS = 10;
const BODY_OPTIONS: ShadedRectangleOptions = {
  lightSource: 'leftTop',
  baseColor: FELColors.acPowerSupplyBodyColorProperty,
  cornerRadius: CORNER_RADIUS
};

export default class ACPowerSupplyNode extends Node {

  public constructor( acPowerSupply: ACPowerSupply, currentSourceProperty: TReadOnlyProperty<CurrentSource>, tandem: Tandem ) {

    const bodyNode = new ShadedRectangle( BODY_BOUNDS, BODY_OPTIONS );

    super( {
      children: [ bodyNode ],
      visibleProperty: new DerivedProperty( [ currentSourceProperty ], currentSource => ( currentSource === acPowerSupply ), {
        tandem: tandem.createTandem( 'visibleProperty' ),
        phetioValueType: BooleanIO
      } ),
      tandem: tandem
    } );
  }

  public static createIcon( scale = 1 ): Node {

    const circle = new Circle( {
      radius: 18,
      fill: FELColors.acPowerSupplyDisplayColorProperty
    } );

    // Sine wave symbol
    const sineDataSet = createSineDataSet( 0, 25, 25, -8, 1 );
    const sineShape = new Shape().moveToPoint( sineDataSet[ 0 ] );
    for ( let i = 1; i < sineDataSet.length; i++ ) {
      sineShape.lineToPoint( sineDataSet[ i ] );
    }
    const sinePath = new Path( sineShape, {
      stroke: FELColors.acPowerSupplyWaveColorProperty,
      lineWidth: 3,
      center: circle.center
    } );

    return new Node( {
      children: [ circle, sinePath ],
      pickable: false
    } );
  }
}

/**
 * Creates a data set for a sine wave, an array of Vector2, ordered by ascending x value.
 */
function createSineDataSet( xMin: number, xMax: number, period: number, amplitude: number, delta: number ): Vector2[] {
  const dataSet = [];
  const frequency = 2 * Math.PI / period;
  for ( let x = xMin; x <= xMax; x += delta ) {
    dataSet.push( new Vector2( x, amplitude * Math.sin( x * frequency ) ) );
  }
  return dataSet;
}

faradaysElectromagneticLab.register( 'ACPowerSupplyNode', ACPowerSupplyNode );