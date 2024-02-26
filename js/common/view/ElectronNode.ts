// Copyright 2023-2024, University of Colorado Boulder

/**
 * ElectronNode is the visual representation of an electron in a coil. It is responsible for moving the electron,
 * and for jumping the electron between foreground and background layers of the scene graph.
 *
 * This is based on ElectronGraphic.java in the Java version of this sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Electron from '../model/Electron.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import FELColors from '../FELColors.js';
import { Node } from '../../../../scenery/js/imports.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

const DIAMETER = 9;

export default class ElectronNode extends ShadedSphereNode {

  private readonly electron: Electron;
  private readonly foregroundNode: Node;
  private readonly backgroundNode: Node;
  private parentNode: Node | null;

  public constructor( electron: Electron, foregroundNode: Node, backgroundNode: Node, visibleProperty: TReadOnlyProperty<boolean> ) {

    super( DIAMETER, {
      visibleProperty: visibleProperty,
      mainColor: FELColors.electronColorProperty,
      pickable: false
    } );

    this.electron = electron;
    this.foregroundNode = foregroundNode;
    this.backgroundNode = backgroundNode;
    this.parentNode = null;

    this.move();
  }

  /**
   * Moves this ElectronNode to the position and coil segment of its associated Electron.
   */
  public move(): void {

    // Move to the electron's position.
    this.translation = this.electron.position;

    // Layer that the electron occupies (foreground vs background).
    const layer = this.electron.getCoilSegment( this.electron.coilSegmentIndex ).layer;
    const newParentNode = ( layer === 'foreground' ) ? this.foregroundNode : this.backgroundNode;

    // If the electron has jumped to a different layer, move it to the new layer.
    if ( newParentNode !== this.parentNode ) {
      if ( this.parentNode ) {
        this.parentNode.removeChild( this );
      }
      newParentNode.addChild( this );
      this.parentNode = newParentNode;
    }
  }
}

faradaysElectromagneticLab.register( 'ElectronNode', ElectronNode );