export const ORDER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    CANCELED: 'canceled',
    PENDING: 'pending',
    FULLFILLED: 'fullfilled',
    SHIPPING: 'shipping',
};

export const ORDER_STATUS_OPTIONS = [{
    label: 'order.ready_to_shipping',
    value: ORDER_STATUS.FULLFILLED,
    color: '#53c66e',
}, {
    label: 'order.shipping',
    value: ORDER_STATUS.SHIPPING,
    color: '#53c66e',
}, {
    label: 'shared.canceled',
    value: ORDER_STATUS.CANCELED,
    color: '#ff4d4f',
}, {
    label: 'shared.pending',
    value: ORDER_STATUS.PENDING,
    color: '#eab308',
}];
