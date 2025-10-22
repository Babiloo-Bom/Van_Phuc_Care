export const TRANSACTION_STATUS = {
    ACTIVE: 'active',
    PENDING: 'pending',
    CANCEL: 'cancel',
};

export const TRANSACTION_STATUS_OPTIONS = [{
    label: 'Thành công',
    value: TRANSACTION_STATUS.ACTIVE,
    color: '#53c66e',
}, {
    label: 'Đang xử lý',
    value: TRANSACTION_STATUS.PENDING,
    color: 'orange',
}, {
    label: 'Đã hủy',
    value: TRANSACTION_STATUS.CANCEL,
    color: '#ff4d4f',
}];
