// Docs for MIME types: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types

export const OFFICE_TYPES = [
    'application/doc',
    'application/ms-doc',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/excel',
    'application/vnd.ms-excel',
    'application/x-excel',
    'application/x-msexcel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/mspowerpoint',
    'application/powerpoint',
    'application/vnd.ms-powerpoint',
    'application/x-mspowerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

export const IMAGE_TYPES = [
    'image/gif',
    'image/vnd.microsoft.icon',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/tiff',
    'image/webp',
];

export const VIDEO_TYPES = [
    'video/x-msvideo',
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/mp2t',
    'video/webm',
    'video/3gpp',
    'video/3gpp2',
    'audio/x-m4a',
];

export const AUDIO_TYPES = [
    'audio/aac',
    'audio/midi',
    'audio/x-midi',
    'audio/mpeg',
    'audio/ogg',
    'audio/opus',
    'audio/wav',
    'audio/webm',
    'audio/3gpp',
    'audio/3gpp2',
];

export const PDF_TYPES = [
    'application/pdf',
];

export const PREVIEWABLE_FILE_TYPES = [
    ...OFFICE_TYPES,
    ...IMAGE_TYPES,
    ...VIDEO_TYPES,
    ...AUDIO_TYPES,
    ...PDF_TYPES,
];
