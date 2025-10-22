export const STATUS_TRANSACTION = {
    SUCCESS: 'success',
    FAILD: 'faild',
    WAITTING: 'watting',
};

export const STATUS_TRANSACTION_OPTIONS = [{
    label: 'Thành công',
    value: STATUS_TRANSACTION.SUCCESS,
    color: '#15CF74',
}, {
    label: 'Thất bại',
    value: STATUS_TRANSACTION.FAILD,
    color: '#7FE790',
}, {
    label: 'Đang chờ',
    value: STATUS_TRANSACTION.WAITTING,
    color: '#FFA500',
}];
