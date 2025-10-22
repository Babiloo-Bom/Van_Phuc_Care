import vi from 'date-fns/locale/vi';
import { format } from 'date-fns';
import { parseDateString } from '@/utils/date';

/**
 * @param {Date|number|string} date
 * @param {string} format
 * @param {string|null} fromFormat
 */
export default (date, toFormat = 'dd/MM/yyyy', fromFormat) => {
    const then = typeof date === 'string' ? parseDateString(date, fromFormat) : date;

    return then ? format(then, toFormat, { locale: vi }) : null;
};
