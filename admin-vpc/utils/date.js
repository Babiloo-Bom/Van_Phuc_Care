import { parse, parseISO, format } from 'date-fns';

export const dateFormat = (date, toFormat = 'DD MMM YYYY, HH:mm A') => format(new Date(date), toFormat);
export const parseDateString = (date, fromFormat) => (fromFormat ? parse(date, fromFormat, new Date()) : parseISO(date));
