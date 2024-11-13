/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,SUQzAwAAAAAIJVRTU0UAAAAbAAAB//5MAGEAdgBmADYAMAAuADMALgAxADAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDE9IBHkGlFrujjoQUMJ/XtnHxVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+2DE+QAJIGlDtdSAIm4b6X89ggFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+xDE1gPAAAGkHAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;