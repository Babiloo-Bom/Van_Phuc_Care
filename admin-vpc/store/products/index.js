export const state = () => ({
    products: null,
    pagination: {},
    product: {},
    productSelected: [],
    columns: [
        {
            value: 'thumbnail',
            label: 'shared.image',
            status: true,
            width: 80,
            fixed: 'left',
        },
        {
            value: '_id',
            label: 'SKU',
            status: false,
            width: 90,
        },
        {
            value: 'name',
            label: 'other.name',
            status: true,
            width: 100,
        },
        {
            value: 'price',
            label: 'other.price',
            status: true,
            width: 100,
        },
        {
            value: 'quantityInStock',
            label: 'product.in_stock',
            status: true,
            width: 100,
        },
        {
            value: 'quantitySelled',
            label: 'shared.selled',
            status: true,
            width: 100,
        },
        {
            value: 'status',
            label: 'shared.status',
            status: true,
            width: 100,
        },
        {
            value: 'category.name',
            label: 'collection.name',
            status: false,
            width: 100,
        },
    ],
});

export const getters = {
};

export const mutations = {
    SET_PRODUCTS(state, payload) {
        state.products = payload;
    },
    SET_PRODUCT(state, payload) {
        state.product = payload;
    },
    SET_PRODUCT_SELECTED(state, payload) {
        state.productSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { products, pagination } } = await this.$api.products.getAll(params);

        commit('SET_PRODUCTS', products);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, productId) {
        const { data: { product } } = await this.$api.products.getDetail(productId);
        commit('SET_PRODUCT', product);
    },
    async update({ commit }, params) {
        const { data: { product } } = await this.$api.products.update(params.id, params.data);
        commit('SET_PRODUCT', product);
    },
    async create({ commit }, params) {
        const { data: { product } } = await this.$api.products.create(params);
        commit('SET_PRODUCT', product);
    },
    async selectedProduct({ commit }, params) {
        commit('SET_PRODUCT_SELECTED', params);
    },
    async uploadFileExcel(context, params) {
        const data = new FormData();
        data.append('files', params.files);
        data.append('categoryId', params.categoryId);
        data.append('categoryName', params.categoryName);
        data.append('type', params.type);
        data.append('new_category', params.new_category);
        data.append('method', params.method);
        await this.$axios.post('/api/a/products/import', data);
    },
};
