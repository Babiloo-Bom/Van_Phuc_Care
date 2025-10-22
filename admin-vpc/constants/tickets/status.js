export const TICKET_STATUS = {
    ACTIVE: 'active',
    PENDING: 'pending',
    PROCESS: 'process',
    CANCEL: 'cancel',
};

export const TICKET_STATUS_OPTIONS = [{
    label: 'Thành công',
    value: TICKET_STATUS.ACTIVE,
    color: '#53c66e',
}, {
    label: 'Chờ xử lý',
    value: TICKET_STATUS.PENDING,
    color: 'orange',
}, {
    label: 'Đang xử lý',
    value: TICKET_STATUS.PROCESS,
    color: 'ff4d4f',
}, {
    label: 'Đã hủy',
    value: TICKET_STATUS.CANCEL,
    color: '#ff4d4f',
}];
