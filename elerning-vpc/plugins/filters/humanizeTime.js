import {
    format,
    formatDistanceStrict,
    differenceInDays,
    differenceInCalendarYears,
} from 'date-fns';
import vi from 'date-fns/locale/vi';

import { parseDateString } from '@/utils/date';

/**
 * @param {Date|string|number} date
 * @param {string} fromFormat
 */
export default (date, fromFormat) => {
    const now = new Date();
    const then = typeof date === 'string' ? parseDateString(date, fromFormat) : date;

    const daysPassed = differenceInDays(now, then);

    // 10 minutes
    if (daysPassed < 1) {
        return formatDistanceStrict(then, now, { addSuffix: true, locale: vi });
    }

    // Monday, 17:34 PM
    if (daysPassed < 7) {
        return format(then, 'iiii, H:mm', { locale: vi });
    }

    // Feb 25th, 17:34 PM
    if (differenceInCalendarYears(now, then) < 1) {
        return format(then, 'do MMM, H:mm', { locale: vi });
    }

    // Feb 25th 2018, 17:34 PM
    return format(then, 'MM.do.yyyy, H:mm', { locale: vi });
};
