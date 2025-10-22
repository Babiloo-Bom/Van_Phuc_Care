/**
 * @param   {string} phone
 * @returns {string}
 */
export default (phone = '') => {
    if (phone) {
        const match = phone
            .replace(/\D+/g, '').replace(/^1/, '')
            .match(/([^\d]*\d[^\d]*){1,10}$/)?.[0] || [];
        const part1 = match.length > 2 ? `${match.substring(0, 4)}` : match;
        const part2 = match.length > 3 ? `${match.substring(4, 7)}` : '';
        const part3 = match.length > 6 ? `${match.substring(7, 10)}` : '';
        return `${part1} ${part2} ${part3}`;
    }

    return '';
};
