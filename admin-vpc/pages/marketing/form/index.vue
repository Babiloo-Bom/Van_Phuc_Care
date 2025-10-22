<template>
    <div>
        <!-- <div
            class="!mx-auto block p-3 pt-0 w-full h-full"
            style="position: absolute;
                    background: #00000075;
                    z-index: 999;
                    width: 100%;
                    transform: translate(-50%, 0);
                    left: 50%;"
        />
        <div
            class="!mx-auto block fixed p-3 pt-0 w-fit h-fit"
            style="
                    z-index: 9999;
                    transform: translate(-50%, 0);
                    top: 32%;
                    left: 57%;"
        >
            <a-button
                class="!flex items-center justify-center gap-2 !h-14 !my-3 !px-6 mx-auto cursor-pointer !w-fit card !rounded-full"
                @click="windowOpenLink"
            >
                <img class="w-8 h-8" src="https://cdn.synck.io.vn/favicon.png" alt="google">
                <span class="font-bold text-[16px]">Upgrade System</span>
            </a-button>
            <p class="!text-[#fff] text-[12px]">
                <i>*Thông tin mang tính chất minh họa</i>
            </p>
        </div> -->
        <div class="card mb-4">
            <div class="flex justify-between items-end">
                <FormFilters />
                <div class="flex items-center gap-4">
                    <nuxt-link to="/marketing/form/tao-moi">
                        <a-button type="primary" class="!flex items-center gap-2 justify-center">
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="m-0"
                            ><line
                                x1="12"
                                y1="5"
                                x2="12"
                                y2="19"
                            /><line
                                x1="5"
                                y1="12"
                                x2="19"
                                y2="12"
                            /></svg>
                            {{ 'Thêm mới' }}
                        </a-button>
                    </nuxt-link>
                </div>
            </div>
        </div>
        <div class="card">
            <FormTable
                :forms="[]"
                :loading="loadingTable"
            />
            <!-- <ct-pagination :data="pagination" /> -->
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import FormFilters from '@/components/marketings/forms/Filters.vue';
    import FormTable from '@/components/marketings/forms/Table.vue';

    export default {
        components: {
            FormFilters,
            FormTable,
        },
        async fetch() {
            this.checking = true;
            await this.fetchData();
            this.checking = false;
        },
        data() {
            return {
                loading: false,
                search: false,
                checking: false,
                loadingTable: false,
            };
        },
        computed: {
            ...mapState('forms', ['forms', 'pagination']),
        },
        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('customers/fetchAll', { ...this.$route.query });
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
                label: 'Form khảo sát',
                link: '/marketing/form',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.customers.length === 0) {
                        await this.$store.dispatch('customers/fetchAll', { ...this.$route.query });
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Form khảo sát',
            };
        },
    };
</script>
