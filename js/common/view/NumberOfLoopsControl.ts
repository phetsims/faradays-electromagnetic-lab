// Copyright 2023-2025, University of Colorado Boulder

/**
 * NumberOfLoopsControl is a labeled spinner for controlling the number of loops in a coil.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import NumberSpinner from '../../../../sun/js/NumberSpinner.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import faradaysElectromagneticLab from '../../faradaysElectromagneticLab.js';
import FaradaysElectromagneticLabStrings from '../../FaradaysElectromagneticLabStrings.js';
import FELConstants from '../FELConstants.js';

export default class NumberOfLoopsControl extends HBox {

  public constructor( numberOfLoopsProperty: NumberProperty, tandem: Tandem ) {

    const labelText = new Text( FaradaysElectromagneticLabStrings.loopsStringProperty, {
      font: FELConstants.CONTROL_FONT,
      maxWidth: 100
    } );

    const spinner = new NumberSpinner( numberOfLoopsProperty, numberOfLoopsProperty.rangeProperty, {
      arrowsPosition: 'leftRight', // so that they can be larger
      touchAreaXDilation: 5,
      touchAreaYDilation: 3,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 3,
      numberDisplayOptions: {
        textOptions: {
          font: FELConstants.CONTROL_FONT
        },
        tandem: Tandem.OPT_OUT
      },
      tandem: tandem.createTandem( 'spinner' ),
      phetioVisiblePropertyInstrumented: false // use numberOfLoopsControl.visibleProperty
    } );

    super( {
      isDisposable: false,
      children: [ labelText, spinner ],
      spacing: 5,
      layoutOptions: { stretch: false }, // Prevent the parent from adding space between labelText and spinner.
      tandem: tandem,
      phetioVisiblePropertyInstrumented: true,
      visiblePropertyOptions: {
        phetioFeatured: true
      }
    } );
  }
}

faradaysElectromagneticLab.register( 'NumberOfLoopsControl', NumberOfLoopsControl );