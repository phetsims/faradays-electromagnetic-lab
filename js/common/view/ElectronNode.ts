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

  private readonly disposeElectronNode: () => void;

  public constructor( electron: Electron ) {

    super( DIAMETER, {
      visibleProperty: electron.visibleProperty,
      mainColor: FELColors.electronColorProperty
    } );

    // Move to the electron's position.
    const positionListener = ( position: Vector2 ) => {
      this.translation = position;
    };
    electron.positionProperty.link( positionListener );

    // If the electron has jumped to a different layer (foreground vs background), move it to the new parent Node.
    const coilSegmentIndexListener = ( newIndex: number, oldIndex: number | null ) => {

      const newParentNode = electron.getCoilSegment( newIndex ).parentNode;
      assert && assert( newParentNode );

      if ( oldIndex !== null ) {
        const oldParentNode = electron.getCoilSegment( oldIndex ).parentNode;
        assert && assert( oldParentNode );
        if ( newParentNode !== oldParentNode ) {
          oldParentNode.removeChild( this );
          newParentNode.addChild( this );
        }
      }
      else {
        newParentNode.addChild( this );
      }
      assert && assert( this.getParent(), 'expected this ElectronNode to have a parent' );
    };
    electron.coilSegmentIndexProperty.link( coilSegmentIndexListener );

    this.disposeElectronNode = () => {
      electron.positionProperty.unlink( positionListener );
      // electron.coilSegmentIndexProperty.unlink( coilSegmentIndexListener );
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeElectronNode();
  }
}

faradaysElectromagneticLab.register( 'ElectronNode', ElectronNode );