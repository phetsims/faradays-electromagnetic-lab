// Copyright 2024, University of Colorado Boulder

/**
 * ElectronsNode is the visual representation of a collection of electrons in a coil. It shows electrons for one layer
 * (foreground or background) of the coil, and hides electrons that are in the other layer. Two instances of this
 * class are needed to render all electrons in a coil. It uses scenery's Sprites feature for performance optimization.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Circle, Color, Node, Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites, TColor } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import FELColors from '../FELColors.js';
import Electron from '../model/Electron.js';
import Coil, { CoilLayer } from '../model/Coil.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import MinusNode from '../../../../scenery-phet/js/MinusNode.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';

const ELECTRON_DIAMETER = 9;
const ELECTRON_RADIUS = ELECTRON_DIAMETER / 2;
const MINUS_SIZE = new Dimension2( 0.65 * ELECTRON_DIAMETER, 0.15 * ELECTRON_DIAMETER );

// Scale up by this much to improve resolution.
const ELECTRON_RESOLUTION_SCALE = 8;

// Inverse scale to apply when rendering.
const ELECTRON_INVERSE_SCALE = 1 / ELECTRON_RESOLUTION_SCALE;

const electronColorProperty = FELColors.electronColorProperty;

export default class ElectronsNode extends Sprites {

  // ElectronsNode will show electrons that are in this layer of the coil.
  private readonly coilLayer: CoilLayer;

  // The single Sprite used to render all electrons.
  private readonly sprite: Sprite;

  // One ElectronSpriteInstance for each electron.
  private readonly spriteInstances: ElectronSpriteInstance[];

  public constructor( coilLayer: CoilLayer, coil: Coil ) {

    // Convert an ElectronNode to a Sprite.
    const sprite = new Sprite( ElectronsNode.getSpriteImage( electronColorProperty.value ) );

    // To be populated by this.ElectronSpriteInstance
    const spriteInstances: ElectronSpriteInstance[] = [];

    super( {
      isDisposable: false,
      visibleProperty: coil.electronsVisibleProperty,
      sprites: [ sprite ], // the set of Sprites used to render this Node, must be set at instantiation
      spriteInstances: spriteInstances, // the set of SpriteInstances, one per electron in the coil
      hitTestSprites: false,
      pickable: false
    } );

    this.sprite = sprite;
    this.spriteInstances = spriteInstances;
    this.coilLayer = coilLayer;

    // When the set of electrons changes, create a sprite instance for each electron.
    coil.electronsProperty.link( electrons => this.createSpriteInstances( electrons ) );

    coil.coilSegmentsProperty.link( coilSegments => {
      const bounds = Bounds2.NOTHING.copy();

      for ( const coilSegment of coilSegments ) {
        coilSegment.expandBoundsToFit( bounds );
      }

      // make sure the bounds are large enough to contain the electrons
      bounds.dilate( ELECTRON_RADIUS );

      this.canvasBounds = bounds;
    } );

    // When the electrons have moved, update the sprite instances.
    coil.electronsMovedEmitter.addListener( () => this.updateSpriteInstances() );

    // If the electron color changes, update the sprite and redraw.
    electronColorProperty.lazyLink( electronColor => {
      sprite.imageProperty.value = ElectronsNode.getSpriteImage( electronColor );
      this.invalidatePaint();
    } );
  }

  /**
   * Creates the SpriteInstances to match a set of electrons. We're not bothering with SpriteInstance pooling because
   * this happens rarely, and the time to create new instances is not noticeable.
   */
  private createSpriteInstances( electrons: Electron[] ): void {

    // Dispose of the SpriteInstances that we currently have.
    this.spriteInstances.forEach( spriteInstance => spriteInstance.dispose() );
    this.spriteInstances.length = 0;

    // Create new SpriteInstances for the new set of electrons.
    electrons.forEach( electron => this.spriteInstances.push( new ElectronSpriteInstance( electron, this.coilLayer, this.sprite ) ) );

    this.invalidatePaint();
  }

  /**
   * Updates the spriteInstances to match the electrons.
   */
  private updateSpriteInstances(): void {
    this.spriteInstances.forEach( spriteInstance => spriteInstance.update() );
    this.invalidatePaint();
  }

  /**
   * Creates an icon for the 'Electrons' checkbox.
   */
  public static createIcon(): Node {
    return new NegativeElectronNode( electronColorProperty );
  }

  /**
   * Gets the SpriteImage used to visualize an electron.
   */
  private static getSpriteImage( electronColor: Color ): SpriteImage {

    const electronNode = new NegativeElectronNode( electronColor, ELECTRON_RESOLUTION_SCALE );

    let spriteImage: SpriteImage | null = null;
    electronNode.toCanvas( ( canvas, x, y, width, height ) => {
      spriteImage = new SpriteImage( canvas, new Vector2( ( x + electronNode.width / 2 ), ( y + electronNode.height / 2 ) ), {

        // Mipmapping was added to address pixelation reported in https://github.com/phetsims/faradays-electromagnetic-lab/issues/121
        mipmap: true,
        mipmapBias: -0.7 // Use a negative value to increase the displayed resolution. See Imageable.setMipmapBias.
      } );
    } );

    assert && assert( spriteImage );
    return spriteImage!;
  }
}

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/136 Delete ElectronNode or NegativeElectronNode
/**
 * ElectronNode is the visual representation of an electron, a shaded sphere.
 */
// class ElectronNode extends ShadedSphereNode {
//   public constructor( color: TColor, scale = 1 ) {
//     super( ELECTRON_DIAMETER, {
//       mainColor: color,
//       scale: scale
//     } );
//   }
// }

/**
 * NegativeElectronNode is the visual representation of an electron - a flat circle with a '-' sign in the center,
 * to address misconceptions about direction of current.
 */
class NegativeElectronNode extends Node {
  public constructor( color: TColor, scale = 1 ) {

    const circle = new Circle( {
      radius: ELECTRON_RADIUS,
      fill: color
    } );

    const minusNode = new MinusNode( {
      size: MINUS_SIZE,
      center: circle.center,
      fill: 'white'
    } );

    super( {
      children: [ circle, minusNode ],
      scale: scale
    } );
  }
}

/**
 * ElectronSpriteInstance corresponds to one Electron instance.
 */
class ElectronSpriteInstance extends SpriteInstance {

  private readonly electron: Electron;
  private readonly coilLayer: CoilLayer;

  public constructor( electron: Electron, coilLayer: CoilLayer, sprite: Sprite ) {

    super();

    this.electron = electron;
    this.coilLayer = coilLayer;

    // Fields in superclass SpriteInstance that must be set
    this.sprite = sprite;
    this.transformType = SpriteInstanceTransformType.TRANSLATION;

    this.update();
  }

  public dispose(): void {
    // Nothing to do currently. But this class is allocated dynamically, so keep this method as a bit of defensive programming.
  }

  /**
   * Updates the matrix to match the electron's position and layering.
   */
  public update(): void {

    if ( this.electron.getLayer() === this.coilLayer ) {

      // Move to the electron's position (at the electron's center) and apply inverse scale.
      this.matrix.rowMajor(
        ELECTRON_INVERSE_SCALE, 0, this.electron.x + ELECTRON_RADIUS,
        0, ELECTRON_INVERSE_SCALE, this.electron.y + ELECTRON_RADIUS,
        0, 0, 1
      );
      assert && assert( this.matrix.isFinite(), 'matrix should be finite' );

      // Show the electron.
      this.alpha = 1;
    }
    else {

      // It the electron is not in this layer, hide it by setting its alpha to fully-transparent.
      // And since it will not be visible, do not bother to move it.
      this.alpha = 0;
    }
  }
}

faradaysElectromagneticLab.register( 'ElectronsNode', ElectronsNode );