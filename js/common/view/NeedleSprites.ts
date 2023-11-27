// Copyright 2023, University of Colorado Boulder

/**
 * NeedleSprites is the visualization of the B-field as a 2D grid of compass needles.  It uses scenery's Sprites
 * feature for performance optimization.
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
import Multilink from '../../../../axon/js/Multilink.js';
import NeedleNode from './NeedleNode.js';
import FELQueryParameters from '../FELQueryParameters.js';

export default class NeedleSprites extends Sprites {

  private readonly barMagnet: BarMagnet;
  private readonly visibleBoundsProperty: TReadOnlyProperty<Bounds2>;
  private readonly needleSprite: NeedleSprite;
  private readonly needleSpriteInstances: NeedleSpriteInstance[];
  private readonly scratchVector: Vector2;

  public constructor( barMagnet: BarMagnet, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const needleSprite = new NeedleSprite();
    const needleSpriteInstances: NeedleSpriteInstance[] = [];

    super( {
      isDisposable: false,
      sprites: [ needleSprite ],
      spriteInstances: needleSpriteInstances,
      hitTestSprites: false,
      visibleProperty: visibleProperty,
      tandem: tandem
    } );

    this.barMagnet = barMagnet;
    this.visibleBoundsProperty = visibleBoundsProperty;

    this.needleSprite = needleSprite;
    this.needleSpriteInstances = needleSpriteInstances;
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
    //TODO See gas-properties.ParticlesNode for SpriteInstance pooling.
    this.needleSpriteInstances.forEach( needleSpriteInstance => needleSpriteInstance.dispose() );
    this.needleSpriteInstances.length = 0;

    // Make the grid fill the visible bounds.
    const visibleBounds = this.visibleBoundsProperty.value;
    console.log( `visibleBounds=${visibleBounds}` );
    for ( let x = visibleBounds.left; x < visibleBounds.right; x = x + FELQueryParameters.needleSpacing ) {
      for ( let y = visibleBounds.top; y < visibleBounds.bottom; y = y + FELQueryParameters.needleSpacing ) {
        this.needleSpriteInstances.push( new NeedleSpriteInstance( this.needleSprite, new Vector2( x, y ), 0 ) );
      }
    }

    this.update();
  }

  private update(): void {
    this.needleSpriteInstances.forEach( needleSpriteInstance => {
      this.barMagnet.getBField( needleSpriteInstance.position, this.scratchVector );
      needleSpriteInstance.rotationProperty.value = this.scratchVector.angle;

      //TODO Should this use this.scratchVector.magnitude?
      needleSpriteInstance.alpha = this.barMagnet.strengthProperty.value / this.barMagnet.strengthProperty.rangeProperty.value.max;
    } );
    this.invalidatePaint();
  }
}

class NeedleSprite extends Sprite {
  public constructor() {

    // Convert a NeedleNode to a SpriteImage.
    let spriteImage: SpriteImage;
    const needleNode = new NeedleNode();
    needleNode.toCanvas( ( canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number ) => {
      const offset = new Vector2( needleNode.width / 2, needleNode.height / 2 );
      spriteImage = new SpriteImage( canvas, offset );
    } );

    super( spriteImage! );
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

    // rotation (yaw)
    this.matrix.setToRotationZ( this.rotationProperty.value );

    // translation
    this.matrix.set02( this.position.x );
    this.matrix.set12( this.position.y );

    assert && assert( this.matrix.isFinite(), 'matrix should be finite' );
  }
}

faradaysElectromagneticLab.register( 'NeedleSprites', NeedleSprites );