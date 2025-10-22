export const COLLECTION_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    WAIT: 'wait',
};

export const COLLECTION_STATUS_OPTIONS = [{
    label: 'product.active',
    value: COLLECTION_STATUS.ACTIVE,
    color: '#53c66e',
}, {
    label: 'Hết hàng',
    value: COLLECTION_STATUS.INACTIVE,
    color: 'red',
}, {
    label: 'Tạm ngưng',
    value: COLLECTION_STATUS.WAIT,
    color: 'yellow',
}];
