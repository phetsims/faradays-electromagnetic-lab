// Copyright 2024, University of Colorado Boulder

//TODO https://github.com/phetsims/faradays-electromagnetic-lab/issues/136 Rename to CurrentInCoilNode?
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
import ArrowNode from '../../../../scenery-phet/js/ArrowNode.js';
import { CurrentType } from '../FELQueryParameters.js';
import FELPreferences from '../model/FELPreferences.js';
import Multilink from '../../../../axon/js/Multilink.js';

const ELECTRON_DIAMETER = 9;
const ELECTRON_RADIUS = ELECTRON_DIAMETER / 2;
const MINUS_SIZE = new Dimension2( 0.65 * ELECTRON_DIAMETER, 0.15 * ELECTRON_DIAMETER );

// Scale up by this much to improve resolution.
const ELECTRON_RESOLUTION_SCALE = 8;

// Inverse scale to apply when rendering.
const ELECTRON_INVERSE_SCALE = 1 / ELECTRON_RESOLUTION_SCALE;

const electronColorProperty = FELColors.electronColorProperty;
const electronMinusColorProperty = FELColors.electronMinusColorProperty;
const conventionalCurrentColorProperty = FELColors.conventionalCurrentColorProperty;

export default class ElectronsNode extends Sprites {

  // ElectronsNode will show electrons that are in this layer of the coil.
  private readonly coilLayer: CoilLayer;

  // The single Sprite used to render all electrons.
  private readonly sprite: Sprite;

  // One ElectronSpriteInstance for each electron.
  private readonly spriteInstances: ElectronSpriteInstance[];

  public constructor( coilLayer: CoilLayer, coil: Coil ) {

    // Create the Sprite used to represent current.
    const sprite = new Sprite( ElectronsNode.getSpriteImage( FELPreferences.currentTypeProperty.value,
      electronColorProperty.value, electronMinusColorProperty.value, conventionalCurrentColorProperty.value ) );

    // To be populated by this.ElectronSpriteInstance.
    const spriteInstances: ElectronSpriteInstance[] = [];

    super( {
      isDisposable: false,
      visibleProperty: coil.electronsVisibleProperty,
      // visibleProperty: new DerivedProperty(
      //   [ FELPreferences.currentTypeProperty, coil.electronsVisibleProperty, coil.currentAmplitudeProperty ],
      //   ( currentType, electronsVisible, currentAmplitude ) =>
      //     electronsVisible && ( ( currentType === 'electron' ) || ( currentType === 'conventional' ) && currentAmplitude !== 0 )
      // ),
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

      // Make sure the bounds are large enough to contain the SpriteInstances.
      bounds.dilate( ELECTRON_RADIUS );

      this.canvasBounds = bounds;
    } );

    // When the electrons have moved, update the sprite instances.
    coil.electronsMovedEmitter.addListener( () => this.updateSpriteInstances() );

    // Update the sprite and redraw.
    Multilink.multilink( [ FELPreferences.currentTypeProperty, electronColorProperty, electronMinusColorProperty, conventionalCurrentColorProperty ],
      ( currentType, electronColor, electronMinusColor, conventionCurrentColor ) => {
        sprite.imageProperty.value = ElectronsNode.getSpriteImage( currentType, electronColor, electronMinusColor, conventionCurrentColor );
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
   * Creates an icon for 'electron' current type.
   */
  public static createElectronIcon( scale = 1.5 ): Node {
    return new ElectronNode( electronColorProperty, electronMinusColorProperty, scale );
  }

  /**
   * Creates an icon for 'conventional' current type.
   */
  public static createConventionalIcon( scale = 1.5 ): Node {
    return new ConventionalCurrentNode( conventionalCurrentColorProperty, scale );
  }

  /**
   * Gets the SpriteImage used to visualize current.
   */
  private static getSpriteImage( currentType: CurrentType,
                                 electronColor: Color,
                                 electronMinusColor: Color,
                                 conventionCurrentColor: Color ): SpriteImage {

    const node = ( currentType === 'electron' ) ?
                 new ElectronNode( electronColor, electronMinusColor, ELECTRON_RESOLUTION_SCALE ) :
                 new ConventionalCurrentNode( conventionCurrentColor, ELECTRON_RESOLUTION_SCALE );

    let spriteImage: SpriteImage | null = null;
    node.toCanvas( ( canvas, x, y, width, height ) => {
      spriteImage = new SpriteImage( canvas, new Vector2( ( x + node.centerX ), ( y + node.centerY ) ), {

        // Mipmapping was added to address pixelation reported in https://github.com/phetsims/faradays-electromagnetic-lab/issues/121
        mipmap: true,
        mipmapBias: -0.7 // Use a negative value to increase the displayed resolution. See Imageable.setMipmapBias.
      } );
    } );

    assert && assert( spriteImage );
    return spriteImage!;
  }
}

/**
 * ElectronNode is the visual representation of 'electron' current - a flat blue circle with a '-' sign in the center.
 */
class ElectronNode extends Node {
  public constructor( color: TColor, minusColor: TColor, scale = 1 ) {

    const circle = new Circle( {
      radius: ELECTRON_RADIUS,
      fill: color
    } );

    const minusNode = new MinusNode( {
      size: MINUS_SIZE,
      center: circle.center,
      fill: minusColor
    } );

    super( {
      children: [ circle, minusNode ],
      scale: scale
    } );
  }
}

/**
 * ConventionalCurrentNode is the visual representation of conventional current: a red arrow.
 */
class ConventionalCurrentNode extends ArrowNode {
  public constructor( color: TColor, scale = 1 ) {
    super( 0, 0, 0, ELECTRON_DIAMETER, {
      scale: scale,
      headHeight: 7,
      headWidth: 7,
      tailWidth: 2,
      fill: color,
      stroke: 'black',
      lineWidth: 0.5
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

      // Reflect about the x-axis so that arrows for convention current are pointing in the direction of conventional
      // current flow.  We do not bother checking current type, because electrons look the same when reflected about
      // the x-axis.
      const yScale = ( this.electron.getLayer() === 'foreground' && this.electron.currentAmplitudeProperty.value >= 0 ) ||
                     ( this.electron.getLayer() === 'background' && this.electron.currentAmplitudeProperty.value < 0 )
                     ? ELECTRON_INVERSE_SCALE : -ELECTRON_INVERSE_SCALE;

      // Move to the electron's position (at the electron's center) and apply inverse scale.
      this.matrix.rowMajor(
        ELECTRON_INVERSE_SCALE, 0, this.electron.x,
        0, yScale, this.electron.y,
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