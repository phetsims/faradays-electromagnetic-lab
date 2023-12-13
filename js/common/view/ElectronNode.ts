// Copyright 2023, University of Colorado Boulder

/**
 * ElectronGraphic is the visual representation of an electron in a coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import Electron from '../model/Electron.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import FELColors from '../FELColors.js';

const DIAMETER = 9;

export default class ElectronNode extends ShadedSphereNode {

  private readonly electron: Electron;
  private readonly disposeElectronNode: () => void;

  public constructor( electron: Electron, tandem: Tandem ) {

    super( DIAMETER, {
      visibleProperty: electron.visibleProperty,
      mainColor: FELColors.electronColorProperty,
      tandem: tandem
    } );

    this.electron = electron;

    this.electron.positionProperty.link( position => {
      this.translation = position;
    } );

    this.disposeElectronNode = () => {
      this.electron.dispose();
    };
  }

  public override dispose(): void {
    super.dispose();
    this.disposeElectronNode();
  }
}

faradaysElectromagneticLab.register( 'ElectronNode', ElectronNode );