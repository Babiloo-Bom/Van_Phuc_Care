export const SERVICES_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
};

export const SERVICES_STATUS_OPTIONS = [{
    label: 'Bản nháp',
    value: SERVICES_STATUS.DRAFT,
    color: 'purple',
}, {
    label: 'Hoạt động',
    value: SERVICES_STATUS.ACTIVE,
    color: 'green',
}, {
    label: 'Không hoạt động',
    value: SERVICES_STATUS.INACTIVE,
    color: 'orange',
}];
