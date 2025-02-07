// Copyright 2023-2024, University of Colorado Boulder

/**
 * FieldNode is the visualization of a magnet's B-field as a 2D grid of compass needles. It uses scenery's Sprites
 * feature for performance optimization.
 *
 * This is based on BFieldOutsideGraphic.java and AbstractBFieldGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Sprites from '../../../../scenery/js/nodes/Sprites.js';
import Color from '../../../../scenery/js/util/Color.js';
import Sprite from '../../../../scenery/js/util/Sprite.js';
import SpriteImage from '../../../../scenery/js/util/SpriteImage.js';
import SpriteInstance, { SpriteInstanceTransformType } from '../../../../scenery/js/util/SpriteInstance.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELColors from '../FELColors.js';
import Magnet from '../model/Magnet.js';
import CompassNeedleNode from './CompassNeedleNode.js';

// Scale up by this much to improve resolution.
const COMPASS_NEEDLE_RESOLUTION_SCALE = 8;

// Inverse scale to apply when rendering.
const COMPASS_NEEDLE_INVERSE_SCALE = 1 / COMPASS_NEEDLE_RESOLUTION_SCALE;

export default class FieldNode extends Sprites {

  private readonly magnet: Magnet; // the magnet whose field is being visualized
  private readonly visibleBoundsProperty: TReadOnlyProperty<Bounds2>; // the visible bounds of the browser window
  private readonly sprite: Sprite; // the single Sprite used to render all compass needles in the grid
  private readonly spriteInstances: CompassNeedleSpriteInstance[]; // the individual compass needles in the grid
  private readonly reusableFieldVector: Vector2; // a reusable instance for getting field vectors

  public static readonly NEEDLE_SPACING = 40; // needle spacing in the x and y directions

  public constructor( magnet: Magnet, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, tandem: Tandem ) {

    const sprite = new Sprite( FieldNode.getSpriteImage(
      FELColors.compassNeedleNorthColorProperty.value,
      FELColors.compassNeedleSouthColorProperty.value
    ) );

    const spriteInstances: CompassNeedleSpriteInstance[] = [];

    super( {
      isDisposable: false,
      visibleProperty: magnet.fieldVisibleProperty,
      sprites: [ sprite ], // the set of Sprites used to render this Node, must be set at instantiation
      spriteInstances: spriteInstances, // the set of SpriteInstances, one per compass needle in the grid
      hitTestSprites: false,
      tandem: tandem,
      phetioFeatured: true
    } );

    this.magnet = magnet;
    this.visibleBoundsProperty = visibleBoundsProperty;
    this.sprite = sprite;
    this.spriteInstances = spriteInstances;
    this.reusableFieldVector = new Vector2( 0, 0 );

    // Update to match the magnet's B-field.
    Multilink.multilink(
      [ magnet.positionProperty, magnet.rotationProperty, magnet.strengthProperty, magnet.fieldScaleProperty ],
      () => this.update()
    );

    // Rebuild the grid to fill the visible bounds of the browser window.
    const visibleBoundsListener = ( visibleBounds: Bounds2 ) => {
      this.canvasBounds = visibleBounds;
      this.rebuild();
    };
    this.visibleBoundsProperty.link( visibleBoundsListener );

    // If the colors change, update the sprite and redraw.
    Multilink.multilink( [ FELColors.compassNeedleNorthColorProperty, FELColors.compassNeedleSouthColorProperty ],
      ( compassNeedleNorthColor, compassNeedleSouthColor ) => {
        sprite.imageProperty.value = FieldNode.getSpriteImage( compassNeedleNorthColor, compassNeedleSouthColor );
        this.invalidatePaint();
      } );

    this.addLinkedElement( magnet );
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
    const margin = FieldNode.NEEDLE_SPACING / 4;
    for ( let x = visibleBounds.left + margin; x <= visibleBounds.right; x = x + FieldNode.NEEDLE_SPACING ) {
      for ( let y = visibleBounds.top + margin; y <= visibleBounds.bottom; y = y + FieldNode.NEEDLE_SPACING ) {
        this.spriteInstances.push( new CompassNeedleSpriteInstance( new Vector2( x, y ), this.sprite ) );
      }
    }

    // Now update the SpriteInstances that we created to match the B-field of the magnet.
    this.update();
  }

  /**
   * Updates all compass needles to match the B-field of the magnet.
   */
  private update(): void {
    this.spriteInstances.forEach( spriteInstance => {
      const fieldVector = this.magnet.getFieldVector( spriteInstance.position, this.reusableFieldVector );
      spriteInstance.setRotation( fieldVector.angle );
      spriteInstance.alpha = FieldNode.normalizeMagnitude( fieldVector.magnitude, this.magnet.strengthRange.max, this.magnet.fieldScaleProperty.value );
    } );
    this.invalidatePaint();
  }

  /**
   * Converts field magnitude to a normalized value in the range [0,1].
   */
  public static normalizeMagnitude( magnitude: number, maxMagnitude: number, fieldScale: number ): number {
    assert && assert( magnitude >= 0 && magnitude <= maxMagnitude, `invalid strength: ${magnitude}` );
    assert && assert( fieldScale >= 1, `invalid fieldScale: ${fieldScale}` );

    // Range is [0,1]
    let normalizedMagnitude = ( magnitude / maxMagnitude );

    // Scale, because in reality the strength drops off quickly, and we wouldn't see much of the B-field.
    normalizedMagnitude = Math.pow( normalizedMagnitude, 1 / fieldScale );

    // Increase normalizedStrength just outside the ends of the magnet to improve the transition in that area.
    normalizedMagnitude *= 2;
    if ( normalizedMagnitude > 1 ) {
      normalizedMagnitude = 1;
    }

    assert && assert( normalizedMagnitude >= 0 && normalizedMagnitude <= 1, `invalid normalizedStrength: ${normalizedMagnitude}` );
    return normalizedMagnitude;
  }

  /**
   * Gets the SpriteImage used to visualize a point in the field -- a compass needle.
   */
  private static getSpriteImage( compassNeedleNorthColor: Color, compassNeedleSouthColor: Color ): SpriteImage {

    // Convert a CompassNeedleNode to a Sprite.
    const compassNeedleNode = new CompassNeedleNode( {
      northFill: compassNeedleNorthColor,
      southFill: compassNeedleSouthColor,

      // Apply a scale to increase resolution (we'll apply the inverse scale when rendering).
      scale: COMPASS_NEEDLE_RESOLUTION_SCALE
    } );

    let spriteImage!: SpriteImage;

    compassNeedleNode.toCanvas( ( canvas, x, y, width, height ) => {
      spriteImage = new SpriteImage( canvas, new Vector2( ( x + compassNeedleNode.centerX ), ( y + compassNeedleNode.centerY ) ), {

        // Mipmapping was added to address pixelation reported in https://github.com/phetsims/faradays-electromagnetic-lab/issues/113.
        // It looked too "sharp" without mipmapping at the normal view distance, so we'll have these generated.
        mipmap: true,
        mipmapBias: -0.7 // Use a negative value to increase the displayed resolution. See Imageable.setMipmapBias.
      } );
    } );

    assert && assert( spriteImage );
    return spriteImage;
  }
}

/**
 * CompassNeedleSpriteInstance corresponds to one compass needle in the grid.
 */
class CompassNeedleSpriteInstance extends SpriteInstance {

  public readonly position: Vector2;

  public constructor( position: Vector2, sprite: Sprite ) {

    super();

    this.position = position;

    // Fields in superclass SpriteInstance that must be set
    this.sprite = sprite;
    this.transformType = SpriteInstanceTransformType.TRANSLATION_AND_ROTATION;
  }

  public dispose(): void {
    // Nothing to do currently. But instances of this class are allocated dynamically, so keep this method as a bit of defensive programming.
  }

  /**
   * Updates the matrix to match the needle's position and rotation.
   */
  public setRotation( rotation: number ): void {
    this.matrix.setToScaleTranslationRotationPoint( COMPASS_NEEDLE_INVERSE_SCALE, this.position, rotation );
    assert && assert( this.matrix.isFinite(), 'expected matrix to be finite' );
  }
}

faradaysElectromagneticLab.register( 'FieldNode', FieldNode );