// Copyright 2024, University of Colorado Boulder

/**
 * ElectronsNode is the visual representation of current in a coil. Depending on the current convention selected,
 * it shows either electrons or imaginary positive charges. It shows charges for one layer (foreground or background)
 * of the coil, and hides charges that are in the other layer. Two instances of this class are needed to render all
 * charges in a coil. It uses scenery's Sprites feature for performance optimization.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import { Color, Sprite, SpriteImage, SpriteInstance, SpriteInstanceTransformType, Sprites } from '../../../../scenery/js/imports.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import FELColors from '../FELColors.js';
import Electron from '../model/Electron.js';
import Coil, { CoilLayer } from '../model/Coil.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ElectronNode from './ElectronNode.js';
import { CurrentType } from '../FELQueryParameters.js';
import FELPreferences from '../model/FELPreferences.js';
import PositiveChargeNode from './PositiveChargeNode.js';

// Scale up by this much to improve resolution.
const ELECTRON_RESOLUTION_SCALE = 8;

// Inverse scale to apply when rendering.
const ELECTRON_INVERSE_SCALE = 1 / ELECTRON_RESOLUTION_SCALE;

const electronColorProperty = FELColors.electronColorProperty;
const electronMinusColorProperty = FELColors.electronMinusColorProperty;
const positiveChargeColorProperty = FELColors.positiveChargeColorProperty;
const positiveChargePlusColorProperty = FELColors.positiveChargePlusColorProperty;

export default class ElectronsNode extends Sprites {

  // ElectronsNode will show charges that are in this layer of the coil.
  private readonly coilLayer: CoilLayer;

  // The single Sprite used to render all charges.
  private readonly sprite: Sprite;

  // One ElectronSpriteInstance for each charge.
  private readonly spriteInstances: ElectronSpriteInstance[];

  public constructor( coilLayer: CoilLayer, coil: Coil ) {

    // Convert the Sprite used to represent current.
    const sprite = new Sprite( ElectronsNode.getSpriteImage(
      FELPreferences.currentTypeProperty.value,
      electronColorProperty.value, electronMinusColorProperty.value,
      positiveChargeColorProperty.value, positiveChargePlusColorProperty.value
    ) );

    // To be populated by this.ElectronSpriteInstance.
    const spriteInstances: ElectronSpriteInstance[] = [];

    super( {
      isDisposable: false,
      visibleProperty: coil.currentVisibleProperty,
      sprites: [ sprite ], // the set of Sprites used to render this Node, must be set at instantiation
      spriteInstances: spriteInstances, // the set of SpriteInstances, one per charge in the coil
      hitTestSprites: false,
      pickable: false
    } );

    this.sprite = sprite;
    this.spriteInstances = spriteInstances;
    this.coilLayer = coilLayer;

    // When the set of charges changes, create a sprite instance for each charge.
    coil.chargedParticlesProperty.link( electrons => this.createSpriteInstances( electrons ) );

    coil.coilSegmentsProperty.link( coilSegments => {
      const bounds = Bounds2.NOTHING.copy();

      for ( const coilSegment of coilSegments ) {
        coilSegment.expandBoundsToFit( bounds );
      }

      // Make sure the bounds are large enough to contain the SpriteInstances.
      bounds.dilate( ElectronNode.DIAMETER / 2 );

      this.canvasBounds = bounds;
    } );

    // When the charges have moved, update the sprite instances.
    coil.chargedParticlesMovedEmitter.addListener( () => this.updateSpriteInstances() );

    // Update the sprite and redraw.
    Multilink.multilink(
      [ FELPreferences.currentTypeProperty, electronColorProperty, electronMinusColorProperty, positiveChargeColorProperty, positiveChargePlusColorProperty ],
      ( currentType, electronColor, electronMinusColor, positiveChargeColor, positiveChargePlusColor ) => {
        sprite.imageProperty.value = ElectronsNode.getSpriteImage( currentType, electronColor, electronMinusColor, positiveChargeColor, positiveChargePlusColor );
        this.invalidatePaint();
      } );
  }

  /**
   * Creates the SpriteInstances to match a set of charges. We're not bothering with SpriteInstance pooling because
   * this happens rarely, and the time to create new instances is not noticeable.
   */
  private createSpriteInstances( electrons: Electron[] ): void {

    // Dispose of the SpriteInstances that we currently have.
    this.spriteInstances.forEach( spriteInstance => spriteInstance.dispose() );
    this.spriteInstances.length = 0;

    // Create new SpriteInstances for the new set of charges.
    electrons.forEach( electron => this.spriteInstances.push( new ElectronSpriteInstance( electron, this.coilLayer, this.sprite ) ) );

    this.invalidatePaint();
  }

  /**
   * Updates the spriteInstances to match the charges.
   */
  private updateSpriteInstances(): void {
    this.spriteInstances.forEach( spriteInstance => spriteInstance.update() );
    this.invalidatePaint();
  }

  /**
   * Gets the SpriteImage used to visualize a charge.
   */
  private static getSpriteImage( currentType: CurrentType,
                                 electronColor: Color, electronMinusColor: Color,
                                 positiveChargeColor: Color, positiveChargePlusColor: Color ): SpriteImage {

    const node = ( currentType === 'electron' ) ?
                 new ElectronNode( {
                   color: electronColor,
                   minusColor: electronMinusColor,
                   scale: ELECTRON_RESOLUTION_SCALE
                 } ) :
                 new PositiveChargeNode( {
                   color: positiveChargeColor,
                   plusColor: positiveChargePlusColor,
                   scale: ELECTRON_RESOLUTION_SCALE
                 } );

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
   * Updates the matrix to match the charge's position and layering.
   */
  public update(): void {

    if ( this.electron.getLayer() === this.coilLayer ) {

      // Move to the charge's position (at the charge's center) and apply inverse scale.
      this.matrix.rowMajor(
        ELECTRON_INVERSE_SCALE, 0, this.electron.x,
        0, ELECTRON_INVERSE_SCALE, this.electron.y,
        0, 0, 1
      );
      assert && assert( this.matrix.isFinite(), 'matrix should be finite' );

      // Show foreground more prominently than background.
      this.alpha = ( this.coilLayer === 'foreground' ) ? 1 : 0.5;
    }
    else {

      // It the charge is not in this layer, hide it by setting its alpha to fully-transparent.
      // And since it will not be visible, do not bother to move it.
      this.alpha = 0;
    }
  }
}

faradaysElectromagneticLab.register( 'ElectronsNode', ElectronsNode );