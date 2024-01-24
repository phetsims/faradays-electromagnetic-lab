// Copyright 2023-2024, University of Colorado Boulder

/**
 * FieldNode is the visualization of a magnet's B-field as a 2D grid of compass needles.  It uses scenery's Sprites
 * feature for performance optimization.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import CompassNeedleNode from './CompassNeedleNode.js';
import FELQueryParameters from '../FELQueryParameters.js';
import Magnet from '../model/Magnet.js';
import FELColors from '../FELColors.js';
import Tandem from '../../../../tandem/js/Tandem.js';

const NEEDLE_SPACING = FELQueryParameters.needleSpacing;

export default class FieldNode extends Sprites {

  private readonly magnet: Magnet; // the magnet whose field is being visualized
  private readonly visibleBoundsProperty: TReadOnlyProperty<Bounds2>; // the visible bounds of the browser window
  private readonly sprite: Sprite; // the single Sprite used to render all compass needles in the grid
  private readonly spriteInstances: CompassNeedleSpriteInstance[]; // the individual compass needles in the grid
  private readonly reusableFieldVector: Vector2; // a reusable instance for getting field vectors

  public constructor( magnet: Magnet, visibleBoundsProperty: TReadOnlyProperty<Bounds2>, tandem: Tandem ) {

    // A vector in the field is visualized as a compass needle.
    // Convert a CompassNeedleNode to a Sprite.
    const compassNeedleNode = new CompassNeedleNode();
    let spriteImage: SpriteImage;
    compassNeedleNode.toCanvas( ( canvas, x, y, width, height ) => {
      spriteImage = new SpriteImage( canvas, new Vector2( ( x + compassNeedleNode.width / 2 ), ( y + compassNeedleNode.height / 2 ) ) );
    } );
    const sprite = new Sprite( spriteImage! );

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
        const compassNeedleNode = new CompassNeedleNode( {
          northFill: compassNeedleNorthColor,
          southFill: compassNeedleSouthColor
        } );
        compassNeedleNode.toCanvas( ( canvas, x, y, width, height ) => {
          sprite.imageProperty.value = new SpriteImage( canvas, new Vector2( ( x + compassNeedleNode.width / 2 ), ( y + compassNeedleNode.height / 2 ) ) );
          this.invalidatePaint();
        } );
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
    const margin = NEEDLE_SPACING / 4;
    for ( let x = visibleBounds.left + margin; x <= visibleBounds.right; x = x + NEEDLE_SPACING ) {
      for ( let y = visibleBounds.top + margin; y <= visibleBounds.bottom; y = y + NEEDLE_SPACING ) {
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
      spriteInstance.alpha = this.strengthToAlpha( fieldVector.magnitude, this.magnet.fieldScaleProperty.value );
    } );
    this.invalidatePaint();
  }

  /**
   * Converts magnet strength to alpha color component.
   */
  private strengthToAlpha( strength: number, fieldIntensityScale: number ): number {
    assert && assert( fieldIntensityScale >= 1, `invalid fieldIntensityScale: ${fieldIntensityScale}` );

    const maxStrength = this.magnet.strengthRange.max;
    assert && assert( strength >= 0 && strength <= maxStrength, `invalid strength: ${strength}` );

    let alpha = ( strength / maxStrength );

    // Scale the alpha, because in reality the strength drops off quickly, and we wouldn't see much of the B-field.
    alpha = Math.pow( alpha, 1 / fieldIntensityScale );

    // Increase the alpha of needles just outside the ends of magnet to improve the "look".
    alpha *= 2;
    if ( alpha > 1 ) {
      alpha = 1;
    }

    assert && assert( alpha >= 0 && alpha <= 1, `invalid scaledIntensity: ${alpha}` );
    return alpha;
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
    // Nothing to do currently. But keep this method as a bit of defensive programming for rebuild method.
  }

  /**
   * Updates the matrix to match the needle's position and rotation.
   */
  public setRotation( rotation: number ): void {
    this.matrix.setToTranslationRotationPoint( this.position, rotation );
    assert && assert( this.matrix.isFinite(), 'expected matrix to be finite' );
  }
}

faradaysElectromagneticLab.register( 'FieldNode', FieldNode );