// Copyright 2024, University of Colorado Boulder

/**
 * ElectronsNode is the visual representation of a collection of electrons in a coil. It shows electrons for one layer
 * (foreground or background) of the coil, and hides electrons that are in the other layer. Two instances of this
 * class are needed to render all electrons in a coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Node, Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites, TColor } from '../../../../scenery/js/imports.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import FELColors from '../FELColors.js';
import Electron from '../model/Electron.js';
import Coil, { CoilLayer } from '../model/Coil.js';

const ELECTRON_DIAMETER = 9;
const ELECTRON_RADIUS = ELECTRON_DIAMETER / 2;
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
    const electronNode = new ElectronNode( electronColorProperty.value );
    let spriteImage: SpriteImage;
    electronNode.toCanvas( ( canvas, x, y, width, height ) => {
      spriteImage = new SpriteImage( canvas, new Vector2( ( x + electronNode.width / 2 ), ( y + electronNode.height / 2 ) ) );
    } );
    const sprite = new Sprite( spriteImage! );

    // To be populated by this.ElectronSpriteInstance
    const spriteInstances: ElectronSpriteInstance[] = [];

    super( {
      isDisposable: false,
      visibleProperty: coil.electronsVisibleProperty,
      sprites: [ sprite ], // the set of Sprites used to render this Node, must be set at instantiation
      spriteInstances: spriteInstances, // the set of SpriteInstances, one per compass needle in the grid
      hitTestSprites: false
    } );

    this.sprite = sprite;
    this.spriteInstances = spriteInstances;
    this.coilLayer = coilLayer;

    // When the set of electrons changes, create a sprite instance for each electron.
    coil.electronsProperty.link( electrons => this.createSpriteInstances( electrons ) );

    // When the electrons have moves, update the sprite instances.
    coil.electronsMovedEmitter.addListener( () => this.updateSpriteInstances() );

    // If the electron color changes, update the sprite and redraw.
    electronColorProperty.lazyLink( electronColor => {
      const electronNode = new ElectronNode( electronColor );
      electronNode.toCanvas( ( canvas, x, y, width, height ) => {
        sprite.imageProperty.value = new SpriteImage( canvas, new Vector2( ( x + electronNode.width / 2 ), ( y + electronNode.height / 2 ) ) );
        this.invalidatePaint();
      } );
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
    return new ElectronNode( electronColorProperty );
  }
}

/**
 * ElectronNode is the visual representation of an electron, a shaded sphere.
 */
class ElectronNode extends ShadedSphereNode {
  public constructor( color: TColor ) {
    super( ELECTRON_DIAMETER, {
      mainColor: color
    } );
  }
}

/**
 * ElectronSpriteInstance corresponds to one Electron instance.
 */
class ElectronSpriteInstance extends SpriteInstance {

  public readonly electron: Electron;
  public readonly coilLayer: CoilLayer;

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
    // Nothing to do currently. But keep this method as a bit of defensive programming.
  }

  /**
   * Updates the matrix to match the electron's position and layering.
   */
  public update(): void {

    if ( this.electron.getLayer() === this.coilLayer ) {

      // Move to the electron's position. Position is at the electron's center.
      this.matrix.set02( this.electron.position.x + ELECTRON_RADIUS );
      this.matrix.set12( this.electron.position.y + ELECTRON_RADIUS );
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