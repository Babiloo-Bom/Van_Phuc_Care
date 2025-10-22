<template>
    <div>
        <div v-show="!loading" class="pb-5">
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/contracts')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-4">
                        <h4 class="m-0 text-[20px] font-bold">
                            {{ 'Tạo hợp đồng mới' }}
                        </h4>
                    </div>
                    <div class="flex items-center gap-3">
                        <nuxt-link to="/contracts">
                            <a-button>
                                Hủy bỏ
                            </a-button>
                        </nuxt-link>
                        <a-button
                            type="primary"
                            class="ml-3"
                            :loading="loading"
                            @click="submitForm"
                        >
                            {{ 'Tạo mới' }}
                        </a-button>
                    </div>
                </div>
            </div>

            <div class="mt-4 card-container">
                <a-tabs default-active-key="1" type="card" @change="changeTab">
                    <a-tab-pane key="1" tab="Thông tin hợp đồng" force-render>
                        <ContractForm
                            ref="inforForm"
                            :is-edit="false"
                            :editor-status="editorStatus"
                            :contract="{
                                partner: {
                                    representative: {},
                                },
                                company: {
                                    representative: {},
                                },
                            }"
                            @submit="(contract) => inforFormEmit = contract"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Dịch vụ liên quan">
                        <ProductsForm
                            ref="ProductsForm"
                            :is-edit="false"
                            :editor-status="editorStatus"
                            :contract="{}"
                            @submit="(products) => productsEmit = products"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Cài đặt">
                        <SettingContract :data="form.setting" />
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <div v-show="loading" class="flex items-center justify-center h-full min-h-[450px]">
            <span class="genstech-loader" />
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import {
        convertToFormData,
    } from '@/utils/form';
    import ContractForm from '@/components/contracts/Form.vue';
    import ProductsForm from '@/components/contracts/Products.vue';
    import SettingContract from '@/components/contracts/SettingContract.vue';

    export default {
        components: {
            ContractForm,
            ProductsForm,
            SettingContract,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                editorStatus: true,
                loadingSubmit: false,

                inforFormEmit: null,
                lectureEmit: null,
                productsEmit: null,
                reviewEmit: null,
                form: {
                    setting: {},
                },
            };
        },

        computed: {
            ...mapState('contracts', ['contract']),
            ...mapGetters('contracts', ['products']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Hợp đồng',
                link: '/contracts',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async submitForm() {
                try {
                    this.$refs.inforForm.submit();
                    // this.$refs.ProductsForm.submit();

                    const { form: contractForm } = this.inforFormEmit;

                    console.log({ contractForm: this.inforFormEmit });

                    const { thumbnailFile } = this.inforFormEmit;

                    this.loading = true;
                    const _data = { ...contractForm, products: [...this.products] };

                    const uploadThumbnailPromise = thumbnailFile
                        ? this.$api.uploader.uploadFile(convertToFormData({ files: thumbnailFile }))
                        : Promise.resolve({ data: { fileAttributes: [] } });

                    const [thumbnailResponse] = await Promise.all([uploadThumbnailPromise]);

                    if (thumbnailResponse.data.fileAttributes.length > 0) {
                        _data.thumbnail = thumbnailResponse.data.fileAttributes[0]?.source;
                    }

                    console.log(this.form);
                    // await this.$api.contracts.create({ ..._data, status: 'active' });
                    this.$message.success('Thêm hợp đồng thành công');
                    // await this.$store.dispatch('contracts/fetchAll', this.$route.query);
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            changeTab(value) {
                console.log(value);
            },
        },

        head() {
            return {
                title: 'Tạo hợp đồng mới',
            };
        },
    };
</script>

<style>
.card-container {
  overflow: hidden;
}
.card-container > .ant-tabs-card > .ant-tabs-content {
  min-height: 300px;
  margin-top: -16px;
}

.card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
  background: #fff;
  padding: 16px;
}

.card-container > .ant-tabs-card > .ant-tabs-bar {
  border-color: #fff;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
  border-color: transparent;
  background: transparent;
}

.card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
  border-color: #fff;
  background: #fff;
}
</style>
