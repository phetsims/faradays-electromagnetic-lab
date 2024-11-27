// Copyright 2023-2024, University of Colorado Boulder

/**
 * FELTimeControlNode is a specialization of TimeControlNode for this simulation.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TimeControlNode from '../../../../scenery-phet/js/TimeControlNode.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FELScreenModel from '../model/FELScreenModel.js';

export default class FELTimeControlNode extends TimeControlNode {

  public constructor( model: FELScreenModel, tandem: Tandem ) {
    super( model.isPlayingProperty, {
      playPauseStepButtonOptions: {
        stepForwardButtonOptions: {
          listener: () => model.clock.stepOnce()
        }
      },
      tandem: tandem
    } );
  }
}

faradaysElectromagneticLab.register( 'FELTimeControlNode', FELTimeControlNode );