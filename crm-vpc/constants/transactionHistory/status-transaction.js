export const STATUS_TRANSACTION = {
    ACTIVE: 'active',
    PENDING: 'pending',
    CANCEL: 'cancel',
};

export const STATUS_TRANSACTION_OPTIONS = [{
    label: 'Thành công',
    value: STATUS_TRANSACTION.ACTIVE,
    color: '#53c66e',
}, {
    label: 'Đang xử lý',
    value: STATUS_TRANSACTION.PENDING,
    color: '#ffa500',
}, {
    label: 'Đã hủy',
    value: STATUS_TRANSACTION.CANCEL,
    color: '#ff4d4f',
}];
