// Copyright 2023, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import BarMagnet from '../model/BarMagnet.js';
import barMagnet_png from '../../../images/barMagnet_png.js';
import Multilink from '../../../../axon/js/Multilink.js';

export default class NeedleSprites extends Sprites {

  private readonly barMagnet: BarMagnet;
  private readonly needleSprite: NeedleSprite;
  private readonly spriteInstances: NeedleSpriteInstance[];
  private readonly scratchVector: Vector2;

  public constructor( barMagnet: BarMagnet, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, tandem: Tandem ) {

    const needleSprite = new NeedleSprite();

    super( {
      isDisposable: false,
      sprites: [ needleSprite ],
      hitTestSprites: false,
      tandem: tandem
    } );

    this.barMagnet = barMagnet;

    this.needleSprite = needleSprite;
    this.spriteInstances = [

      //TODO this is a test
      new NeedleSpriteInstance( this.needleSprite, new Vector2( 100, 100 ), 0 ),
      new NeedleSpriteInstance( this.needleSprite, new Vector2( 200, 200 ), 0 )
    ];
    this.scratchVector = new Vector2( 0, 0 );

    Multilink.multilink(
      [ barMagnet.positionProperty, barMagnet.rotationProperty, barMagnet.strengthProperty ],
      () => this.update()
    );

    const visibleBoundsListener = ( visibleBounds: Bounds2 ) => {
      this.canvasBounds = visibleBounds;
      this.rebuild();
    };
    visibleBoundsProperty.link( visibleBoundsListener );
  }

  private rebuild(): void {
    // this.spriteInstances.forEach( spriteInstance => spriteInstance.dispose() );
    // this.spriteInstances.length = 0;

    //TODO this.spriteInstances.push instances of NeedleSpriteInstance to fill this.canvasBounds

    this.update();
  }

  private update(): void {
    // this.spriteInstances.forEach( spriteInstance => {
    //   this.barMagnet.getBField( spriteInstance.position, this.scratchVector );
    //   console.log( `scratchVector=${this.scratchVector} magnitude=${this.scratchVector.magnitude} angle=${this.scratchVector.angle}` );
    //   spriteInstance.rotationProperty.value = this.scratchVector.angle;
    //
    //   //TODO this should use this.scratchVector.magnitude
    //   spriteInstance.alpha = this.barMagnet.strengthProperty.value / this.barMagnet.strengthProperty.rangeProperty.value.max; //TODO
    // } );
    this.invalidatePaint();
  }
}

class NeedleSprite extends Sprite {
  public constructor() {

    // Convert a NeedleNode to a SpriteImage.
    //TODO This is asynchronous. Is there a better way?
    // let spriteImage: SpriteImage;
    // const needleNode = new NeedleNode();
    // needleNode.toCanvas( ( canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number ) => {
    //   const offset = new Vector2( needleNode.width / 2, needleNode.height / 2 );
    //   spriteImage = new SpriteImage( canvas, offset );
    // } );

    //TODO Use image of the bar magnet for now, until I get something to render.
    const spriteImage = new SpriteImage( barMagnet_png, new Vector2( barMagnet_png.width / 2, barMagnet_png.height / 2 ), {
      pickable: false
    } );

    super( spriteImage );
  }
}

class NeedleSpriteInstance extends SpriteInstance {

  public readonly position: Vector2;
  public readonly rotationProperty: Property<number>;

  public constructor( sprite: NeedleSprite, position: Vector2, rotation: number ) {

    super();

    // Fields in superclass SpriteInstance that must be set
    this.sprite = sprite;
    this.transformType = SpriteInstanceTransformType.TRANSLATION_AND_ROTATION;

    this.position = position;
    this.rotationProperty = new NumberProperty( rotation );
    this.rotationProperty.link( () => this.updateMatrix() );
  }

  public dispose(): void {
    this.rotationProperty.dispose();
  }

  /**
   * Updates the matrix to match the needle's position and rotation.
   */
  private updateMatrix(): void {
    // this.matrix.set00( this.rotationProperty.value ); //TODO this is wrong, ignore for now
    this.matrix.set02( this.position.x );
    this.matrix.set12( this.position.y );
    assert && assert( this.matrix.isFinite(), 'matrix should be finite' );
  }
}

faradaysElectromagneticLab.register( 'NeedleSprites', NeedleSprites );