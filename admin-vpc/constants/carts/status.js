export const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    CANCELED: 'canceled',
    PENDING: 'pending',
};

export const STATUS_OPTIONS = [{
    label: 'Đã xử lý',
    value: STATUS.ACTIVE,
    color: 'green',
}, {
    label: 'Đã hủy',
    value: STATUS.INACTIVE,
    color: 'red',
}, {
    label: 'Đã hủy',
    value: STATUS.CANCELED,
    color: 'red',
}, {
    label: 'order.process',
    value: STATUS.PENDING,
    color: 'yellow',
}];
