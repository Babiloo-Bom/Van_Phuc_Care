export const baseUrl = process.browser ? `${window.location.protocol}//${window.location.host}` : process.env.APP_URL;

export function image(imageUrl, size) {
    if (imageUrl && (!imageUrl.includes('http') || !imageUrl.includes('https'))) {
        return size
            ? `${process.env.IMAGE_BASE_URL}/${size}/${encodeURIComponent(imageUrl)}`
            : `${process.env.IMAGE_BASE_URL}/${encodeURIComponent(imageUrl)}`;
    }

    return imageUrl;
}
