import _padStart from 'lodash/padStart';

export default (context, inject) => {
    const helpers = {
        getTableIndex: (pagination, index, pad = 4) => {
            const _index = (parseInt((+pagination.page), 10) - 1) * pagination.pageSize + index + 1;

            return _padStart(_index, pad, '0') || '';
        },
    };

    inject('helpers', helpers);
};
