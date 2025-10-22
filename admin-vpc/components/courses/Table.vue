<template>
    <div>
        <a-table
            :data-source="courses"
            :pagination="false"
            :scroll="{ x: 1200 }"
            :row-key="(row) => row._id"
            :loading="loading"
            class="cursor-pointer !text-[13px]"
        >
            <a-table-column
                key="thumbnail"
                title="Ảnh"
                :width="120"
                align="left"
                data-index="thumbnail"
            >
                <template #default="thumbnail">
                    <img :src="thumbnail" alt="/" class="rounded-md h-16  w-full object-cover">
                </template>
            </a-table-column>
            <a-table-column
                key="title"
                title="Khóa học"
                :width="120"
                align="left"
            >
                <template #default="record">
                    <nuxt-link class="hover:underline" :to="`/khoa-hoc/${record._id}`">
                        {{ record.title }}
                    </nuxt-link>
                </template>
            </a-table-column>
            <a-table-column
                key="video"
                title="Video"
                :width="80"
                align="center"
                data-index="videoCount"
            >
                <template #default="videoCount">
                    <p>
                        {{ videoCount }} videos
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="documents"
                title="Tài liệu"
                :width="80"
                align="center"
                data-index="documentCount"
            >
                <template #default="documentCount">
                    <p>
                        {{ documentCount }} tài liệu
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="exam"
                title="Bài tập"
                :width="80"
                align="center"
                data-index="examCount"
            >
                <template #default="examCount">
                    <p>
                        {{ examCount }} bài
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="status"
                title="Trạng thái"
                align="center"
                :width="100"
            >
                <template #default="record">
                    <a-switch
                        :default-checked="record.status === 'active'"
                        @click="updateShowCourse(record)"
                        @change="onChangeShowCourse"
                    />
                </template>
            </a-table-column>
            <a-table-column
                key="rate"
                title="Đánh giá"
                :width="80"
                align="center"
                data-index="reviewsCount"
            >
                <template #default="reviewsCount">
                    <p>
                        {{ reviewsCount || 0 }}
                    </p>
                </template>
            </a-table-column>
            <a-table-column
                key="price"
                title="Giá"
                :width="150"
                align="center"
                data-index="price"
            >
                <template #default="price">
                    <p v-if="price">
                        {{ price | currencyFormat }}
                    </p>
                    <p v-else>
                        {{ 'Miễn phí' }}
                    </p>
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
                    {{ createdAt | dateFormat('dd/MM/yyyy') }}
                </template>
            </a-table-column>
            <a-table-column
                key="action"
                align="center"
                :width="60"
                fixed="right"
            >
                <template #default="scope">
                    <a-dropdown placement="bottomRight" :trigger="['click']">
                        <a-button class="!mr-0" size="small">
                            <i class="fas fa-ellipsis-h" />
                        </a-button>
                        <a-menu slot="overlay" class="!w-40">
                            <a-menu-item>
                                <nuxt-link
                                    :to="`/khoa-hoc/${scope._id}`"
                                >
                                    Chỉnh sửa khóa học
                                </nuxt-link>
                            </a-menu-item>
                            <!-- <a-menu-item>
                                <nuxt-link
                                    :to="`/khoa-hoc/${scope._id}/bai-giang`"
                                >
                                    Xem bài giảng
                                </nuxt-link>
                            </a-menu-item> -->
                            <a-menu-item class="!text-danger-100" @click="() => { selectedCourse(scope); $refs.ConfirmDialog.open(scope) }">
                                Xóa khóa học
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </template>
            </a-table-column>
        </a-table>
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa khóa học"
            @confirm="confirmDelete"
        >
            <div class="text-center">
                <p class="text-lg">
                    Bạn chắc chắn muốn xóa khóa học này chứ?
                </p>
                <span class="block"><span class="font-semibold">Lưu ý</span>: Hành động không thể hoàn tác</span>
            </div>
        </ConfirmDialog>
        <Dialog ref="Dialog" />
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Dialog from '@/components/courses/Dialog.vue';

    export default {
        components: {
            ConfirmDialog,
            Dialog,
        },

        props: {
            courses: {
                type: Array,
                default: () => [],
            },
            loading: {
                type: Boolean,
                default: false,
            },
        },

        data() {
            return {
                selected: '',
                status: null,
                rowSelection: [],
            };
        },

        computed: {
            ...mapState('courses', ['courseSelected']),
        },
        watch: {
            '$route.query': {
                handler() {
                    // this.addClickListenersToRows();
                },
                deep: true,
                immediate: true,
            },
        },

        mounted() {
            // this.addClickListenersToRows();
        },

        methods: {
            ...mapActions('courses', ['selectedCourse']),
            // addClickListenersToRows() {
            //     // Get all table rows
            //     const rows = document.querySelectorAll('.ant-table-row');
            //     // Attach a click event listener to each row
            //     rows.forEach((row, index) => {
            //         row.addEventListener('click', () => {
            //             this.handleRowClick(this.courses[index]); // Pass the clicked row data
            //         });
            //     });
            // },

            // handleRowClick(row) {
            //     this.$router.push(`/khoa-hoc/${row._id}`);
            // },

            onSelectChange(selectedRowKeys) {
                this.selectedCourse(selectedRowKeys);
            },

            async confirmDelete() {
                try {
                    await this.$api.courses.delete(this.courseSelected._id);
                    this.$message.success('Xóa khóa học thành công');
                    this.$nuxt.refresh();
                } catch (e) {
                    this.$handleError(e);
                }
            },
            async updateShowCourse(record) {
                try {
                    this.$api.courses.update(record._id, { status: this.status ? 'active' : 'inactive' });
                    this.status = null;
                } catch (e) {
                    this.$handleError(e);
                }
            },
            onChangeShowCourse(value) {
                this.status = value;
            },
        },
    };
</script>
