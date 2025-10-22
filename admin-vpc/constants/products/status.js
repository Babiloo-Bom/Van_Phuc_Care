export const PRODUCT_STATUS = {
    ACTIVE: 'active',
    ARCHIVED: 'archived',
    DRAFT: 'draft',
    OUT_STOCK: 'out_stock',
    pause: 'pause',
};

export const PRODUCT_STATUS_OPTIONS = [{
    label: 'product.active',
    value: PRODUCT_STATUS.ACTIVE,
    color: '#53c66e',
}, {
    label: 'product.out_stock',
    value: PRODUCT_STATUS.OUT_STOCK,
    color: '#ff4d4f',
}, {
    label: 'product.draft',
    value: PRODUCT_STATUS.DRAFT,
    color: '#eab308',
}, {
    label: 'product.archived',
    value: PRODUCT_STATUS.ARCHIVED,
    color: '#848484',
}];
