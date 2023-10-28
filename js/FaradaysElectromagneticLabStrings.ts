// Copyright 2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import type LocalizedStringProperty from '../../chipper/js/LocalizedStringProperty.js';
import faradaysElectromagneticLab from './faradaysElectromagneticLab.js';

type StringsType = {
  'faradays-electromagnetic-lab': {
    'titleStringProperty': LocalizedStringProperty;
  };
  'screen': {
    'barMagnetStringProperty': LocalizedStringProperty;
    'pickupCoilStringProperty': LocalizedStringProperty;
    'electromagnetStringProperty': LocalizedStringProperty;
    'transformerStringProperty': LocalizedStringProperty;
    'generatorStringProperty': LocalizedStringProperty;
  }
};

const FaradaysElectromagneticLabStrings = getStringModule( 'FARADAYS_ELECTROMAGNETIC_LAB' ) as StringsType;

faradaysElectromagneticLab.register( 'FaradaysElectromagneticLabStrings', FaradaysElectromagneticLabStrings );

export default FaradaysElectromagneticLabStrings;
