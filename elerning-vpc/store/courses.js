import _cloneDeep from 'lodash/cloneDeep';

export const emptyState = () => ({
    courses: [],
    myCourses: [],
    course: {},
    processing: {},
    chapter: {},
    reviews: null,
    pagination: {},
    courseSelected: [],

    cart: [],
    toast: {
        status: false,
        type: 'success',
        course: {},
    },
});
export const state = emptyState;

export const getters = {
    cart(state) {
        return state.cart;
    },
    dashboard(state) {
        const cart = state.cart;
        const sumPrice = cart ? cart.map((item) => (+item.price)).reduce((a, b) => a + b, 0) : 0;
        const countCart = cart ? cart.length : 0;

        return {
            cart,
            sumPrice,
            countCart,
        };
    },
};

export const mutations = {
    SET_COURSES(state, payload) {
        state.courses = payload;
    },
    SET_MY_COURSES(state, payload) {
        state.myCourses = payload;
    },
    SET_REVIEWS(state, payload) {
        state.reviews = payload;
    },
    SET_COURSE(state, payload) {
        state.course = payload;
    },
    SET_PROCESSING(state, payload) {
        state.processing = payload.processing;
    },
    SET_CHAPTER(state, payload) {
        state.chapter = payload;
    },
    SET_COURSE_SELECTED(state, payload) {
        state.courseSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },

    SET_STATE(state, { prop, data }) {
        state[prop] = data;
    },
    RESET_STATE(state) {
        // eslint-disable-next-line no-unused-vars
        state = emptyState;
    },
    SAVE_LOCAL(state, payload) {
        if (process.client) {
            localStorage.setItem('cart', JSON.stringify(payload));
        }
    },
    GET_LOCAL(state, payload) {
        state.cart = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { courses, pagination } } = await this.$api.courses.getAll(params);

        commit('SET_COURSES', courses);
        commit('SET_PAGINATION', pagination);
    },
    async fetchMyCourse({ commit }, params) {
        const { data: { courses, pagination } } = await this.$api.courses.getMyCourse(params);

        commit('SET_MY_COURSES', courses);
        commit('SET_PAGINATION', pagination);
    },
    async fetchReviews({ commit }, params) {
        const { data: { feedbacks } } = await this.$api.courses.getReviews(params);

        commit('SET_REVIEWS', feedbacks);
    },
    async fetchDetail({ commit }, courseId) {
        const { data: { course } } = await this.$api.courses.getDetail(courseId);
        commit('SET_COURSE', course);
    },
    async fetchProcessing({ commit }, courseId) {
        const { data: { processing } } = await this.$api.courses.getProcessing(courseId);
        commit('SET_PROCESSING', {
            processing,
        });
    },
    async fetchChapter({ commit }, chapterId) {
        const { data: { chapter } } = await this.$api.courses.getChapter(chapterId);
        commit('SET_CHAPTER', chapter);
    },
    async update({ commit }, params) {
        const { data: { course } } = await this.$api.courses.update(params._id, params.data);
        commit('SET_COURSE', course);
    },
    async selectedCourse({ commit }, params) {
        commit('SET_COURSE_SELECTED', params);
    },

    async fetchCart({ commit }) {
        // const { data: { cart } } = await this.$api.carts.getAll(payload);
        const cart = localStorage.getItem('cart') || [];
        commit('SET_STATE', { prop: 'cart', data: JSON.parse(cart) });
    },

    async addToCart(context, payload) {
        context.dispatch('toastProduct', { status: true, data: payload });
        const cacheCart = _cloneDeep(context.state.cart) || [];
        const courseInCart = cacheCart.find((item) => item._id === payload._id);

        if (!courseInCart) {
            cacheCart.unshift({ ...payload });
        } else {
            context.dispatch('removeToCart', courseInCart);
        }
        context.commit('SET_STATE', { prop: 'cart', data: cacheCart });
        context.commit('SAVE_LOCAL', cacheCart);
    },

    async removeToCart(context, payload) {
        const cacheCart = _cloneDeep(context.state.cart);
        const newCart = cacheCart.filter((item) => item._id !== payload._id);
        context.commit('SET_STATE', { prop: 'cart', data: newCart });
        context.commit('SAVE_LOCAL', newCart);
    },

    toastProduct(context, { status, data, typeToast = 'success' }) {
        context.commit('SET_STATE', {
            prop: 'toast',
            data: {
                status,
                course: data,
                type: typeToast,
            },
        });
        setTimeout(() => {
            context.commit('SET_STATE', {
                prop: 'toast',
                data: {
                    status: false,
                    course: data,
                    type: typeToast,
                },
            });
        }, 2000);
    },

    resetState({ commit }) {
        commit('SAVE_LOCAL', []);
        commit('RESET_STATE');
    },
};
