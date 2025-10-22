export const CUSTOMER_STATUS = {
    ACTIVE: 'active',
    AFTER_USE: 'afterUse',
    INACTIVE: 'inactive',
    INVERIFIED: 'inverified',
    VERIFIED: 'verified',
};

export const CUSTOMER_STATUS_OPTIONS = [{
    label: 'Đang sử dụng',
    value: CUSTOMER_STATUS.ACTIVE,
    color: '#53c66e',
}, {
    label: 'Đã xác thực',
    value: CUSTOMER_STATUS.VERIFIED,
    color: '#53c66e',
}, {
    label: 'Sau sử dụng',
    value: CUSTOMER_STATUS.AFTER_USE,
    color: '#ff4d4f',
}];
