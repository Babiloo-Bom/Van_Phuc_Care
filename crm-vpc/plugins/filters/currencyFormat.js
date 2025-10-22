/**
 * @param   {number} number
 * @returns {string}
 */
export default (number) => `${number ? parseInt(number, 10).toLocaleString('de-DE') : '0'} ₫`;
