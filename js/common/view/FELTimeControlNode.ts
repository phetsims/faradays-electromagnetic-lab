// Copyright 2023, University of Colorado Boulder

/**
 * FELTimeControlNode is a specialization of TimeControlNode for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELModel from '../model/FELModel.js';
import Tandem from '../../../../tandem/js/Tandem.js';

export default class FELTimeControlNode extends TimeControlNode {

  public constructor( model: FELModel, tandem: Tandem ) {
    super( model.isPlayingProperty, {
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.stepEmitter.stepOnce()
        }
      },
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'FELTimeControlNode', FELTimeControlNode );