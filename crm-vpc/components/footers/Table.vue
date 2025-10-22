<template>
    <div>
        <a-table
            :data-source="banners"
            :pagination="false"
            :scroll="{ x: 1200 }"
            :row-key="(row) => row._id"
            :loading="loading"
        >
            <a-table-column
                key="index"
                title="STT"
                align="center"
                :width="60"
                :custom-render="
                    (text, record, index) =>index+1
                "
            />
            <a-table-column
                key="thumbnail"
                title="Ảnh"
                :width="150"
                align="center"
                data-index="thumbnail"
            >
                <template #default="thumbnail">
                    <img :src="thumbnail" alt="/" class="rounded-md h-16  w-full object-cover">
                </template>
            </a-table-column>
            <a-table-column
                key="title"
                title="Tiêu đề"
                :width="150"
                align="center"
                data-index="title"
            >
                <template #default="title">
                    <p v-if="title">
                        {{ title }}
                    </p>
                    <p v-else>
                        {{ 'Không có Tiêu đề' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="description"
                title="Mô tả"
                :width="200"
                align="center"
                data-index="description"
            >
                <template #default="description">
                    <p v-if="description">
                        {{ description }}
                    </p>
                    <p v-else>
                        {{ 'Không có mô tả' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="link"
                title="Liên kết"
                :width="200"
                align="center"
                data-index="link"
            >
                <template #default="link">
                    <a
                        v-if="link"
                        :href="link"
                        target="_blank"
                        class="truncate block mx-auto !text-[#0c4ea4] w-full"
                    >
                        {{ link }}...
                    </a>
                    <p v-else>
                        {{ 'Không có Liên kết' }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Hiển thị"
                :width="120"
                align="center"
            >
                <template #default="banner">
                    <a-switch
                        :default-checked="banner.status === 'active' ? true : false"
                        @click="updateBanner(banner)"
                        @change="onChange"
                    />
                </template>
            </a-table-column>
            <a-table-column
                key="createdAt"
                data-index="createdAt"
                title="Ngày tạo"
                align="center"
                :width="120"
            >
                <template #default="createdAt">
                    {{ createdAt | dateFormat('HH:mm dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                title="Thao tác"
                align="center"
                :width="100"
                fixed="right"
            >
                <template #default="banner">
                    <a-button
                        type="primary"
                        shape="circle"
                        @click="() => {
                            bannerSelected = banner,
                            $refs.bannerDialog.open(banner)
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
                            bannerSelected = banner,
                            $refs.confirmDelete.open()}"
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
            title="Xóa banner"
            content="Bạn chắc chắn xóa banner này ?"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script>
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

    export default {
        components: {
            ConfirmDialog,
        },

        props: {
            banners: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },

        async asyncData({ store, query }) {
            await store.dispatch('banners/fetchAll', query);
        },

        data() {
            return {
                bannerSelected: null,
                statusWitch: null,
            };
        },
        computed: {
        },

        methods: {
            async updateBanner(banner) {
                this.bannerSelected = banner;
                try {
                    this.$api.banners.update(this.bannerSelected._id, { status: this.statusWitch ? 'active' : 'inactive' });
                    this.statusWitch = null;
                } catch (e) {
                    this.$handleError(e);
                }
            },
            onChange(banner) {
                this.statusWitch = banner;
            },
            async confirmDelete() {
                try {
                    await this.$api.banners.delete(this.bannerSelected._id);
                    this.$message.success('Xóa banner thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },
    };
</script>
