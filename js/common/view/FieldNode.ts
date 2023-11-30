// Copyright 2023, University of Colorado Boulder

/**
 * FieldNode is the visualization of a magnet's B-field as a 2D grid of compass needles.  It uses scenery's Sprites
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
import Multilink from '../../../../axon/js/Multilink.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import FELQueryParameters from '../FELQueryParameters.js';
import Magnet from '../model/Magnet.js';

const NEEDLE_SPACING = FELQueryParameters.needleSpacing;

export default class FieldNode extends Sprites {

  private readonly magnet: Magnet; // the magnet whose field is being visualized
  private readonly visibleBoundsProperty: TReadOnlyProperty<Bounds2>; // the visible bounds of the browser window
  private readonly sprite: CompassNeedleSprite; // the single Sprite used to render all compass needles in the grid
  private readonly spriteInstances: CompassNeedleSpriteInstance[]; // the individual compass needles in the grid
  private readonly scratchFieldVector: Vector2; // a reusable instance for getting field vectors

  public constructor( magnet: Magnet, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, visibleProperty: TReadOnlyProperty<boolean>, tandem: Tandem ) {

    const sprite = new CompassNeedleSprite();
    const spriteInstances: CompassNeedleSpriteInstance[] = [];

    super( {
      isDisposable: false,
      sprites: [ sprite ], // the set of Sprites used to render this Node, must be set at instantiation
      spriteInstances: spriteInstances, // the set of SpriteInstances, one per compass needle in the grid
      hitTestSprites: false,
      visibleProperty: visibleProperty,
      tandem: tandem
    } );

    this.magnet = magnet;
    this.visibleBoundsProperty = visibleBoundsProperty;
    this.sprite = sprite;
    this.spriteInstances = spriteInstances;
    this.scratchFieldVector = new Vector2( 0, 0 );

    Multilink.multilink(
      [ magnet.positionProperty, magnet.rotationProperty, magnet.strengthProperty ],
      () => this.update()
    );

    const visibleBoundsListener = ( visibleBounds: Bounds2 ) => {
      this.canvasBounds = visibleBounds;
      this.rebuild();
    };
    visibleBoundsProperty.link( visibleBoundsListener );
  }

  /**
   * Rebuilds the grid to fill the visible bounds of the browser. We're not bothering with SpriteInstance pooling
   * because this happens rarely, and the time to rebuild is not noticeable.
   */
  private rebuild(): void {

    // Dispose of any SpriteInstances that we currently have.
    this.spriteInstances.forEach( spriteInstance => spriteInstance.dispose() );
    this.spriteInstances.length = 0;

    // Create new SpriteInstances to fill the visible bounds of the browser window.
    const visibleBounds = this.visibleBoundsProperty.value;
    for ( let x = visibleBounds.left + NEEDLE_SPACING / 2; x <= visibleBounds.right; x = x + NEEDLE_SPACING ) {
      for ( let y = visibleBounds.top + NEEDLE_SPACING / 2; y <= visibleBounds.bottom; y = y + NEEDLE_SPACING ) {
        this.spriteInstances.push( new CompassNeedleSpriteInstance( this.sprite, new Vector2( x, y ) ) );
      }
    }

    this.update();
  }

  /**
   * Updates all compass needles to match the B-field of the magnet.
   */
  private update(): void {
    this.spriteInstances.forEach( spriteInstance => {
      const fieldVector = this.magnet.getFieldVector( spriteInstance.position, this.scratchFieldVector );
      spriteInstance.rotationProperty.value = fieldVector.angle;
      spriteInstance.alpha = strengthToAlpha( fieldVector.magnitude, this.magnet.strengthProperty.rangeProperty.value.max );
    } );
    this.invalidatePaint();
  }
}

/**
 * CompassNeedleSprite is the sprite used to render the compass needles. A single instance is required.
 */
class CompassNeedleSprite extends Sprite {
  public constructor() {

    // Convert a CompassNeedleNode to a SpriteImage.
    let spriteImage: SpriteImage;
    const compassNeedleNode = new CompassNeedleNode();
    compassNeedleNode.toCanvas( ( canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number ) => {
      const offset = new Vector2( compassNeedleNode.width / 2, compassNeedleNode.height / 2 );
      spriteImage = new SpriteImage( canvas, offset );
    } );

    super( spriteImage! );
  }
}

/**
 * CompassNeedleSpriteInstance corresponds to one compass needle in the grid.
 */
class CompassNeedleSpriteInstance extends SpriteInstance {

  public readonly position: Vector2;
  public readonly rotationProperty: Property<number>;

  public constructor( sprite: CompassNeedleSprite, position: Vector2 ) {

    super();

    // Fields in superclass SpriteInstance that must be set
    this.sprite = sprite;
    this.transformType = SpriteInstanceTransformType.TRANSLATION_AND_ROTATION;

    this.position = position;
    this.rotationProperty = new NumberProperty( 0 );
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

/**
 * Converts magnet strength to alpha color component.
 */
function strengthToAlpha( strength: number, maxStrength: number ): number {
  assert && assert( strength >= 0 && strength <= maxStrength, `invalid strength: ${strength}` );

  //TODO Debug the algorithm below from AbstractBFieldGraphic.java updateStrengthAndOrientation. It's dropping off too quickly.
  return 1;

  // let alpha = ( strength / maxStrength );
  //
  // // Scale the alpha, because in reality the strength drops off quickly, and we wouldn't see much of the B-field.
  // alpha = Math.pow( alpha, 1 / FELQueryParameters.outsideBFieldIntensityScale );
  //
  // // Increase the alpha of needles just outside the ends of magnet to improve the "look".
  // alpha *= 2;
  // if ( alpha > 1 ) {
  //   alpha = 1;
  // }
  //
  // assert && assert( alpha >= 0 && alpha <= 1, `invalid scaledIntensity: ${alpha}` );
  // return alpha;
}

faradaysElectromagneticLab.register( 'FieldNode', FieldNode );