// Copyright 2024, University of Colorado Boulder

/**
 * CurrentNode is the visual representation of current in a coil. Depending on the current convention selected,
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
import ChargedParticle from '../model/ChargedParticle.js';
import Coil, { CoilLayer } from '../model/Coil.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Multilink from '../../../../axon/js/Multilink.js';
import ElectronNode from './ElectronNode.js';
import { CurrentFlow } from '../FELQueryParameters.js';
import PositiveChargeNode from './PositiveChargeNode.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

// Scale up by this much when creating Nodes, to improve resolution.
const RESOLUTION_SCALE = 8;

// Inverse scale to apply when rendering SpriteInstances.
const INVERSE_SCALE = 1 / RESOLUTION_SCALE;

const electronColorProperty = FELColors.electronColorProperty;
const electronMinusColorProperty = FELColors.electronMinusColorProperty;
const positiveChargeColorProperty = FELColors.positiveChargeColorProperty;
const positiveChargePlusColorProperty = FELColors.positiveChargePlusColorProperty;

export default class CurrentNode extends Sprites {

  // CurrentNode will show charges that are in this layer of the coil.
  private readonly coilLayer: CoilLayer;

  // The single Sprite used to render all charges.
  private readonly sprite: Sprite;

  // One SpriteInstance for each charge.
  private readonly spriteInstances: ChargedParticleSpriteInstance[];

  public constructor( coilLayer: CoilLayer, coil: Coil, canvasBoundsProperty: TReadOnlyProperty<Bounds2> ) {

    // Convert the Sprite used to represent current.
    const sprite = new Sprite( CurrentNode.getSpriteImage(
      coil.currentFlowProperty.value,
      electronColorProperty.value, electronMinusColorProperty.value,
      positiveChargeColorProperty.value, positiveChargePlusColorProperty.value
    ) );

    // To be populated by this.createSpriteInstances.
    const spriteInstances: ChargedParticleSpriteInstance[] = [];

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
    coil.chargedParticlesProperty.link( chargedParticle => this.createSpriteInstances( chargedParticle ) );

    canvasBoundsProperty.link( bounds => {
      this.canvasBounds = bounds;
    } );

    // When the charges have moved, update the sprite instances.
    coil.chargedParticlesMovedEmitter.addListener( () => this.updateSpriteInstances() );

    // Update the sprite and redraw.
    Multilink.multilink(
      [ coil.currentFlowProperty, electronColorProperty, electronMinusColorProperty, positiveChargeColorProperty, positiveChargePlusColorProperty ],
      ( currentFlow, electronColor, electronMinusColor, positiveChargeColor, positiveChargePlusColor ) => {
        sprite.imageProperty.value = CurrentNode.getSpriteImage( currentFlow, electronColor, electronMinusColor, positiveChargeColor, positiveChargePlusColor );
        this.invalidatePaint();
      } );
  }

  /**
   * Creates the SpriteInstances to match a set of charges. We're not bothering with SpriteInstance pooling because
   * this happens rarely, and the time to create new instances is not noticeable.
   */
  private createSpriteInstances( chargedParticles: ChargedParticle[] ): void {

    // Dispose of the SpriteInstances that we currently have.
    this.spriteInstances.forEach( spriteInstance => spriteInstance.dispose() );
    this.spriteInstances.length = 0;

    // Create new SpriteInstances for the new set of charges.
    chargedParticles.forEach( chargedParticle =>
      this.spriteInstances.push( new ChargedParticleSpriteInstance( chargedParticle, this.coilLayer, this.sprite ) ) );

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
  private static getSpriteImage( currentFlow: CurrentFlow,
                                 electronColor: Color, electronMinusColor: Color,
                                 positiveChargeColor: Color, positiveChargePlusColor: Color ): SpriteImage {

    const node = ( currentFlow === 'electron' ) ?
                 new ElectronNode( {
                   color: electronColor,
                   minusColor: electronMinusColor,
                   scale: RESOLUTION_SCALE
                 } ) :
                 new PositiveChargeNode( {
                   color: positiveChargeColor,
                   plusColor: positiveChargePlusColor,
                   scale: RESOLUTION_SCALE
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
 * ChargedParticleSpriteInstance corresponds to one ChargedParticle instance.
 */
class ChargedParticleSpriteInstance extends SpriteInstance {

  private readonly chargedParticle: ChargedParticle;
  private readonly coilLayer: CoilLayer;

  public constructor( chargedParticle: ChargedParticle, coilLayer: CoilLayer, sprite: Sprite ) {

    super();

    this.chargedParticle = chargedParticle;
    this.coilLayer = coilLayer;

    // Fields in superclass SpriteInstance that must be set
    this.sprite = sprite;
    this.transformType = SpriteInstanceTransformType.TRANSLATION_AND_SCALE;

    this.update();
  }

  public dispose(): void {
    // Nothing to do currently. But instances of this class are allocated dynamically, so keep this method as a bit of defensive programming.
  }

  /**
   * Updates the matrix to match the charge's position and layering.
   */
  public update(): void {

    // Move to the charge's position (at the charge's center) and apply inverse scale.
    this.matrix.rowMajor(
      INVERSE_SCALE, 0, this.chargedParticle.x,
      0, INVERSE_SCALE, this.chargedParticle.y,
      0, 0, 1
    );
    assert && assert( this.matrix.isFinite(), 'matrix should be finite' );

    if ( this.chargedParticle.getLayer() === this.coilLayer ) {

      // Show foreground more prominently than background.
      this.alpha = ( this.coilLayer === 'foreground' ) ? 1 : 0.5;
    }
    else {

      // It the charge is not in this layer, hide it by setting its alpha to fully-transparent.
      this.alpha = 0;
    }
  }
}

faradaysElectromagneticLab.register( 'CurrentNode', CurrentNode );