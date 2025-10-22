export const state = () => ({
    emails: [],
    email: {},
    pagination: {},
    emailSelected: [],
    templates: [
        {
            template_id: '12',
            template_name: 'Vạn Phúc Care chúc mừng ngày Quốc tế Phụ Nữ 8/3',
            thumbnail: 'img_email_template_1709699047.jpg',
            creator_id: '25',
            created_at: '06/03/2024',
            thumbnail_logo: 'https://vanphuccare.getflycrm.com/uploads/img_email_template_1709699047.jpg',
        },
        {
            template_id: '11',
            template_name: 'Vạn Phúc Care chúc mừng Tết Nguyên đán Giáp Thìn 2024 0502',
            thumbnail: 'img_email_template_1707126248.jpg',
            creator_id: '25',
            created_at: '05/02/2024',
            thumbnail_logo: 'https://vanphuccare.getflycrm.com/uploads/img_email_template_1707126248.jpg',
        },
        {
            template_id: '10',
            template_name: 'Vạn Phúc Care chúc mừng Tết Nguyên đán Giáp Thìn 2024 0502',
            thumbnail: 'img_email_template_1707126248.jpg',
            creator_id: '25',
            created_at: '05/02/2024',
            thumbnail_logo: 'https://vanphuccare.getflycrm.com/uploads/img_email_template_1707124777.jpg',
        },
        {
            template_id: '9',
            template_name: 'Vạn Phúc Care chúc mừng Tết Nguyên đán Giáp Thìn 2024',
            thumbnail: 'img_email_template_1706931714.jpg',
            creator_id: '25',
            created_at: '03/02/2024',
            thumbnail_logo: 'https://vanphuccare.getflycrm.com/uploads/img_email_template_1706931714.jpg',
        },
        {
            template_id: '8',
            template_name: 'TB lịch nghỉ Tết chính thức',
            thumbnail: 'img_email_template_1706931714.jpg',
            creator_id: '25',
            created_at: '02/02/2024',
            thumbnail_logo: 'https://vanphuccare.getflycrm.com/uploads/img_email_template_1706868973.jpg',
        },
        {
            template_id: '7',
            template_name: '[Vạn Phúc Care] Thông báo lịch nghỉ Tết Nguyên Đán 2024',
            thumbnail: 'img_email_template_1706931714.jpg',
            creator_id: '25',
            created_at: '30/01/2024',
            thumbnail_logo: 'https://vanphuccare.getflycrm.com/uploads/img_email_template_1706599546.jpg',
        },
    ],
});

export const getters = {
};

export const mutations = {
    SET_EMAILS(state, payload) {
        state.emails = payload;
    },
    SET_EMAIL(state, payload) {
        state.email = payload;
    },
    SET_EMAIL_SELECTED(state, payload) {
        state.emailSelected = payload;
    },

    SET_PAGINATION(state, payload) {
        state.pagination = payload;
    },
};

export const actions = {
    async fetchAll({ commit }, params) {
        const { data: { emails, pagination } } = await this.$api.emails.getAll(params);

        commit('SET_EMAILS', emails);
        commit('SET_PAGINATION', pagination);
    },
    async fetchDetail({ commit }, emailId) {
        const { data: { email } } = await this.$api.emails.getDetail(emailId);
        commit('SET_EMAIL', email);
    },
    async update({ commit }, params) {
        const { data: { email } } = await this.$api.emails.update(params._id, params.data);
        commit('SET_EMAIL', email);
    },
    async selectedCustomer({ commit }, params) {
        commit('SET_EMAIL_SELECTED', params);
    },
};
