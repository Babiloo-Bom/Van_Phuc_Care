<template>
    <div>
        <div class="mb-6 flex items-center flex-wrap gap-2 justify-between">
            <h3 class="mb-0 text-2xl">
                Danh sách dịch vụ
            </h3>
            <a-button
                type="primary"
                @click="() => {
                    $refs.PacketDialog.open(null)
                }"
            >
                Thêm dịch vụ
            </a-button>
        </div>
        <div v-if="data?.length" class=" bg-white rounded-sm">
            <a-table
                :data-source="data"
                :pagination="false"
                :scroll="{ x: 800 }"
                :row-key="(row) => row._id"
                :loading="loading || loadingTable"
            >
                <a-table-column
                    key="index"
                    title="STT"
                    align="center"
                    :width="60"
                    :custom-render="
                        (text, record, index) =>index + 1"
                />
                <a-table-column
                    key="title"
                    title="Tiêu đề"
                    :width="150"
                >
                    <template #default="record">
                        <span class="truncate-2">{{ record.title }}</span>
                    </template>
                </a-table-column>
                <a-table-column
                    key="price"
                    title="Giá"
                    :width="120"
                >
                    <template #default="record">
                        <span class="truncate-2">{{ record.price?.toLocaleString('de-DE') }}đ</span>
                    </template>
                </a-table-column>
                <a-table-column
                    key="descriptions"
                    title="Nội dung"
                    :width="150"
                >
                    <template #default="record">
                        <span class="truncate-2" v-html="record.descriptions" />
                    </template>
                </a-table-column>
                <a-table-column
                    key="action"
                    title="Thao tác"
                    align="center"
                    :width="100"
                    fixed="right"
                >
                    <template #default="_pricing, record, index">
                        <a-button
                            type="primary"
                            shape="circle"
                            @click="() => {
                                pricingSelected = _pricing,
                                $refs.PacketDialog.open(_pricing, index)
                            }"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="css-i6dzq1 mx-auto"
                            ><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                        </a-button>
                        <a-button
                            type="primary"
                            shape="circle"
                            @click="() => {
                                pricingSelected = _pricing,
                                $refs.confirmDelete.open()
                            }"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="css-i6dzq1 mx-auto"
                            ><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line
                                x1="10"
                                y1="11"
                                x2="10"
                                y2="17"
                            /><line
                                x1="14"
                                y1="11"
                                x2="14"
                                y2="17"
                            /></svg>
                        </a-button>
                    </template>
                </a-table-column>
            </a-table>
            <ConfirmDialog
                ref="confirmDelete"
                title="Xóa phản hồi"
                content="Bạn chắc chắn xóa bản ghi này ?"
                @confirm="confirmDelete"
            />
        </div>
        <a-empty v-else />
        <PacketDialog ref="PacketDialog" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import PacketDialog from '@/components/services/PricingDialog.vue';

    export default {
        components: {
            ConfirmDialog,
            PacketDialog,
        },

        props: {
            data: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                pricingSelected: null,
                statusWitch: null,
                loadingTable: false,
                loading: false,
            };
        },

        computed: {
            ...mapState('services', ['service']),
        },

        watch: {
        },

        methods: {
            async updateStatus(_pricing) {
                this.pricingSelected = _pricing;
                try {
                    this.loadingTable = true;
                    this.$api.services.update(this.service._id, { status: this.statusWitch ? 'active' : 'inactive' });
                    this.statusWitch = null;
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    await this.$store.dispatch('services/fetchDetail', this.$route.params.id);
                    this.loadingTable = true;
                }
            },

            onChange(_pricing) {
                this.statusWitch = _pricing;
            },

            async confirmDelete() {
                try {
                    this.loadingTable = true;
                    await this.$api.services.update(this.service._id, { pricings: this.service.pricings.filter((e) => e.title !== this.pricingSelected.title) });
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('services/fetchDetail', this.$route.params.id);
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingTable = false;
                }
            },
        },
    };
</script>

<style lang="scss">
.truncate-2 {
 overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    ul, li {
        margin: 0 !important;
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        padding: 0 !important;
    }
}
</style>
