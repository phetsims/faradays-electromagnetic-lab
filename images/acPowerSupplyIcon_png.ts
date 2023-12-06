/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;