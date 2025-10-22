export const ACCESS_PERMISSIONS_STATUS = {
    ACCEPTED: 'accepted',
    PENDING: 'pending',
    DENIED: 'deny',
};

export const ACCESS_PERMISSIONS_STATUS_OPTIONS = [{
    label: 'Thành công',
    value: ACCESS_PERMISSIONS_STATUS.ACCEPTED,
    color: '#53c66e',
}, {
    label: 'Chờ xử lý',
    value: ACCESS_PERMISSIONS_STATUS.PENDING,
    color: '#ff4d4f',
}, {
    label: 'Từ chối',
    value: ACCESS_PERMISSIONS_STATUS.DENIED,
    color: '#ff4d4f',
}];
