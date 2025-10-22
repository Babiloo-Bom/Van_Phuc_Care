export function mapDataFromOptions(options, key, value) {
    const pairs = {};

    options.forEach((item) => {
        pairs[item[key]] = item[value];
    });

    return pairs;
}

export function slugify(string) {
    return string
        ? string
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : '';
}
