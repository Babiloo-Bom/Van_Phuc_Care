<template>
    <div>
        <div class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-collection">
            <div class="flex items-center justify-start gap-3 mb-4">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/settings')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-3">
                            <h4 class="m-0 text-[20px] font-bold">
                                {{ 'Vai trò & Thành viên' }}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="!configed" class="card !p-0 banner-alert !rounded-md mb-4 ">
                <div class="bg-[#ffb800] rounded-t-md p-4 flex items-center justify-start">
                    <div class="w-5 h-5 mr-2">
                        <svg
                            viewBox="1 1 18 18"
                            class="Polaris-Icon__Svg"
                            focusable="false"
                            aria-hidden="true"
                        ><path d="M10 6.75a.75.75 0 0 1 .75.75v3.5a.75.75 0 1 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z" /><path d="M11 13.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z" /><path fill-rule="evenodd" d="M10 3.5c-1.045 0-1.784.702-2.152 1.447a449.26 449.26 0 0 1-2.005 3.847l-.028.052a403.426 403.426 0 0 0-2.008 3.856c-.372.752-.478 1.75.093 2.614.57.863 1.542 1.184 2.464 1.184h7.272c.922 0 1.895-.32 2.464-1.184.57-.864.465-1.862.093-2.614-.21-.424-1.113-2.147-2.004-3.847l-.032-.061a429.497 429.497 0 0 1-2.005-3.847c-.368-.745-1.107-1.447-2.152-1.447Zm-.808 2.112c.404-.816 1.212-.816 1.616 0 .202.409 1.112 2.145 2.022 3.88a418.904 418.904 0 0 1 2.018 3.875c.404.817 0 1.633-1.212 1.633h-7.272c-1.212 0-1.617-.816-1.212-1.633.202-.408 1.113-2.147 2.023-3.883a421.932 421.932 0 0 0 2.017-3.872Z" /></svg>
                    </div>
                    <h6 class="m-0">
                        Trước khi bạn thêm thành viên:
                    </h6>
                    <p />
                </div>
                <div class="p-4 !rounded-b-md">
                    <p class="m-0">
                        Bạn cần cài đặt <b>Cấu hình email</b> để gửi lời mời cho thành viên
                    </p>
                    <a-button class="!mt-4" @click="openConfigEmail">
                        Cấu hình email
                    </a-button>
                </div>
            </div>
            <div class="card flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h4 class="text-[14px] m-0 font-[600]">
                        Thành viên ({{ pagination.total || 0 }})
                    </h4>
                    <p class="text-[#303030] m-0">
                        Tùy chỉnh những gì thành viên của bạn có thể chỉnh sửa và truy cập. Bạn có thể thêm tối đa 500 thành viên.
                    </p>
                </div>
                <a-button
                    type="primary"
                    class="!flex items-center gap-2 justify-center"
                    @click="$router.push('/settings/members/create')"
                >
                    Thêm thành viên
                </a-button>
            </div>
            <div class="card mt-4 ">
                <h4 class="text-[14px] m-0 font-[600]">
                    Danh sách thành viên
                </h4>
                <Table
                    class="mt-4"
                    :loading="loading || loadingTable"
                    :members="members"
                />
                <ct-pagination :data="pagination" />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Table from '@/components/settings/members/Table.vue';

    export default {
        components: {
            Table,
        },

        async fetch() {
            this.fetchData();
        },

        data() {
            return {
                rules: {},
                form: {},
                loadingTable: false,
                data: [],
                loading: false,
                configed: true,
            };
        },
        computed: {
            ...mapState('settings/members', ['members', 'pagination']),
            ...mapState('settings/contacts', ['contacts']),
        },

        watch: {
            contacts() {
                if (this.contacts.configMail && this.contacts.configMail.host && this.contacts.configMail.port && this.contacts.configMail.auth?.user && this.contacts.configMail.auth?.pass) {
                    this.configed = true;
                } else {
                    this.configed = false;
                }
            },
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('settings/members/fetchAll', { ...this.$route.query });
                    this.loadingTable = false;
                    if (this.$route.query) {
                        this.search = true;
                    } else {
                        this.search = false;
                    }
                },
            },
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Cài đặt',
                link: '/settings',
            }, {
                label: 'Vai trò & Thành viên',
                link: '/settings/members',
            }]);
        },
        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await Promise.all([
                        this.$store.dispatch('settings/contacts/fetchDetail'),
                        this.$store.dispatch('settings/members/fetchAll'),
                    ]);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            openConfigEmail() {
                this.$router.push({ path: '/settings/contact' });
            },
        },

        head() {
            return {
                title: 'Vai trò & Thành viên',
            };
        },
    };
</script>
<style lang="scss">
</style>
