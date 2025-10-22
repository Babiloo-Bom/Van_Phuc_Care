export const SERVICES_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PROCESS: 'process',
    DONE: 'done',
    INVERIFIED: 'inverified',
    VERIFIED: 'verified',
};

export const SERVICES_STATUS_OPTIONS = [{
    label: 'Đang hoạt động',
    value: SERVICES_STATUS.ACTIVE,
    color: '#53c66e',
}, {
    label: 'Cần xử lý',
    value: SERVICES_STATUS.PROCESS,
    color: '#ff4d4f',
}, {
    label: 'Đã phản hồi',
    value: SERVICES_STATUS.DONE,
    color: '#53c66e',
}, {
    label: 'Ẩn',
    value: SERVICES_STATUS.INACTIVE,
    color: '#ff4d4f',
}];
