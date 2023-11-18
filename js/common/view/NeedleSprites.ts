// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Sprite, SpriteImage, SpriteInstance, Sprites } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import NeedleNode from './NeedleNode.js';
import BarMagnet from '../model/BarMagnet.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class NeedleSprites extends Sprites {

  private readonly barMagnet: BarMagnet;
  private sprite: Sprite;
  private readonly spriteInstances: NeedleSpriteInstance[];
  private readonly scratchVector: Vector2;

  private readonly disposeNeedleSprites: () => void;

  public constructor( barMagnet: BarMagnet, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, tandem: Tandem ) {

    // Convert a NeedleNode to a SpriteImage.
    //TODO This is asynchronous. Is there a better way?
    let spriteImage: SpriteImage;
    const needleNode = new NeedleNode();
    needleNode.toCanvas( ( canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number ) => {
      spriteImage = new SpriteImage( canvas, new Vector2( needleNode.width / 2, needleNode.height / 2 ) );
    } );
    const sprite = new Sprite( spriteImage! );

    super( {
      sprites: [ sprite ],
      tandem: tandem
    } );

    this.barMagnet = barMagnet;

    this.sprite = sprite;
    this.spriteInstances = [];
    this.scratchVector = new Vector2( 0, 0 );

    const visibleBoundsListener = () => this.rebuild();
    visibleBoundsProperty.link( visibleBoundsListener );

    const multilink = new Multilink( [ barMagnet.positionProperty, barMagnet.rotationProperty, barMagnet.strengthProperty ],
      () => this.update() );

    this.disposeNeedleSprites = () => {
      this.spriteInstances.forEach( spriteInstance => spriteInstance.dispose() );
      this.spriteInstances.length = 0;
      visibleBoundsProperty.unlink( visibleBoundsListener );
      multilink.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.spriteInstances.forEach( spriteInstance => spriteInstance.dispose() );
    this.spriteInstances.length = 0;
  }

  private rebuild(): void {
    this.spriteInstances.forEach( spriteInstance => spriteInstance.dispose() );
    this.spriteInstances.length = 0;

    //TODO a test...
    this.spriteInstances.push( new NeedleSpriteInstance( this.sprite, new Vector2( 100, 100 ), 0 ) );
    this.spriteInstances.push( new NeedleSpriteInstance( this.sprite, new Vector2( 200, 200 ), 0 ) );
    this.update();

    this.invalidatePaint();
  }

  private update(): void {
    this.spriteInstances.forEach( spriteInstance => {
      this.barMagnet.getBField( spriteInstance.position, this.scratchVector );
      console.log( `scratchVector=${this.scratchVector} magnitude=${this.scratchVector.magnitude} angle=${this.scratchVector.angle}` );
      spriteInstance.rotationProperty.value = this.scratchVector.angle;

      //TODO this should use this.scratchVector.magnitude
      spriteInstance.alpha = this.barMagnet.strengthProperty.value / this.barMagnet.strengthProperty.rangeProperty.value.max; //TODO
    } );
    this.invalidatePaint();
  }
}

class NeedleSpriteInstance extends SpriteInstance {

  public readonly position: Vector2;
  public readonly rotationProperty: Property<number>;

  public constructor( needleSprite: Sprite, position: Vector2, rotation: number ) {

    super();

    this.position = position;
    this.rotationProperty = new NumberProperty( rotation );
    this.rotationProperty.link( () => this.updateMatrix() );
  }

  public dispose(): void {
    this.rotationProperty.dispose();cid
  }

  /**
   * Updates the matrix to match the needle's position and rotation, in the most efficient way possible.
   */
  private updateMatrix(): void {
    // this.matrix.set00( this.rotationProperty.value ); //TODO this is wrong
    this.matrix.set02( this.position.x );
    this.matrix.set12( this.position.y );
    assert && assert( this.matrix.isFinite(), 'matrix should be finite' );
  }
}

faradaysElectromagneticLab.register( 'NeedleSprites', NeedleSprites );