<template>
    <div>
        <div v-if="!loading" class="card-container !px-0 xs:m-0 md:m-0 md:!px-4">
            <a-tabs v-model="tab" type="card">
                <a-tab-pane :key="1" tab="Tất cả dịch vụ">
                    <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 p-2 md:p-4 bg-white">
                        <nuxt-link v-for="(data, index) in services" :key="`card_service_${index}`" :to="`/dich-vu/${data.slug}`">
                            <CardService :data="data" />
                        </nuxt-link>
                    </div>
                </a-tab-pane>
                <a-tab-pane :key="2" tab="Đang sử dụng">
                    <div v-if="servicesUsing.length" class="grid md:grid-cols-4 gap-8 p-4 bg-white">
                        <nuxt-link v-for="(data, index) in servicesUsing" :key="`card_service_${index}`" :to="`/dich-vu/${data.slug}`">
                            <CardService :data="data" />
                        </nuxt-link>
                    </div>
                    <div v-else class="py-8 bg-white">
                        <div class="flex justify-center items-center flex-col">
                            <h3 class="!mb-3 md:text-3xl text-center text-[#868686] font-light">
                                Bạn chưa đăng ký sử dụng dịch vụ nào
                            </h3>
                            <div class="py-1 inline-block px-6 font-semibold !text-white bg-prim-100 rounded-sm cursor-pointer" @click="tab = 1">
                                Danh sách dịch vụ
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div v-else class="flex items-center justify-center h-full min-h-[450px]">
            <span class="genstech-loader" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CardService from '@/components/services/Card.vue';
    import moment from 'moment';

    export default {
        components: {
            CardService,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                tab: 1,
                servicesUsing: [],
            };
        },

        computed: {
            ...mapState('services', ['services', 'registeredService']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Dịch vụ',
                link: '/dich-vu',
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
            }]);
        },

        methods: {
            moment,
            async fetchData() {
                try {
                    this.loading = true;
                    await Promise.all([
                        this.$store.dispatch('services/fetchAll', { ...this.$route.query }),
                        this.$store.dispatch('services/fetchServiceUsing', { ...this.$route.query, email: this.$auth.user.email }),
                    ]);
                    this.servicesUsing = this.services?.filter((e) => this.registeredService.map((record) => record.serviceId)?.includes(e._id));
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },

        head() {
            return {
                title: 'Dịch vụ',
            };
        },
    };
</script>
<style lang="scss" >
.card-container {
  overflow: hidden;
  padding: 0 24px;
  .ant-tabs-nav.ant-tabs-nav-animated {
    margin-left: 24px;
  }
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    border-radius: 10px;
}
@media only screen and (max-width: 600px) {
    .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    padding: 0;
    }
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
    color :#BABABA;
    font-weight: 500;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
    font-weight: 600;
    color :#0C76BC;
}
</style>
