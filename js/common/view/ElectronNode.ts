// Copyright 2023, University of Colorado Boulder

/**
 * ElectronGraphic is the visual representation of an electron in a coil. It is responsible for moving the electron,
 * and for jumping the electron between foreground and background layers of the scenegraph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Electron from '../model/Electron.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import FELColors from '../FELColors.js';
import Vector2 from '../../../../dot/js/Vector2.js';

const DIAMETER = 9;

export default class ElectronNode extends ShadedSphereNode {

  private readonly electron: Electron;
  private readonly disposeElectronNode: () => void;

  public constructor( electron: Electron ) {

    super( DIAMETER, {
      visibleProperty: electron.visibleProperty,
      mainColor: FELColors.electronColorProperty
    } );

    this.electron = electron;

    // Move to the electron's position.
    const positionListener = ( position: Vector2 ) => {
      this.translation = position;
    };
    this.electron.positionProperty.link( positionListener );

    // If the electron has jumped to a different layer (foreground vs background), move it in the scenegraph.
    const pathIndexListener = ( pathIndex: number, oldPathIndex: number | null ) => {
      const newParentNode = electron.getPathDescriptor( pathIndex ).parentNode;
      if ( oldPathIndex !== null ) {
        const oldParentNode = electron.getPathDescriptor( oldPathIndex ).parentNode;
        if ( newParentNode !== oldParentNode ) {
          oldParentNode.removeChild( this );
          newParentNode.addChild( this );
        }
      }
      else {
        newParentNode.addChild( this );
      }
    };
    this.electron.pathIndexProperty.link( pathIndexListener );

    this.disposeElectronNode = () => {
      this.electron.positionProperty.unlink( positionListener );
      this.electron.pathIndexProperty.unlink( pathIndexListener );
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeElectronNode();
  }
}

faradaysElectromagneticLab.register( 'ElectronNode', ElectronNode );