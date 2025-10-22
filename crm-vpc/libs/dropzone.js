import Dropzone from 'dropzone';

Dropzone.autoDiscover = false;

/**
 * @param {string|Element} el
 * @param {Dropzone.DropzoneOptions} options
 * @returns {Dropzone}
 */
export const createDropzone = (el, options, accessToken) => new Dropzone(el, {
    url: '/upload/single-upload',
    acceptedFiles: 'image/jpeg,image/png,image/gif',
    maxFiles: 5,
    maxFilesize: 6, // MB
    headers: {
        Authorization: accessToken,
    },
    ...options,
});
