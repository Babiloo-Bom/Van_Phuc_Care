<template>
    <div class=" bg-white rounded-sm">
        <div class="p-4">
            <div class="flex gap-4 items-start justify-start">
                <div>
                    <a-avatar v-if="data?.createdBy?.avatar" :src="data?.createdBy?.avatar" class="!text-[#1a77ba]  border-[1px] border-[#ececec] p-[2px]" />
                    <a-avatar v-else class="!text-[#1a77ba] !bg-[#d6e8ff] ">
                        <i class="fas fa-user" />
                    </a-avatar>
                </div>
                <div class="w-full">
                    <div class="flex items-center justify-between">
                        <p class="m-0 font-[600] text-[13px]">
                            {{ `${data?.createdBy?.firstName || ''} ${data.createdBy?.lastName || ''} ${data.createdBy?.fullname || ''}` }}
                        </p>
                        <div class="flex items-center gap-2">
                            <p class="m-0 text-[12px]">
                                {{ data?.createdAt | dateFormat('HH:mm dd/MM/yyyy') }}
                            </p>
                            <a-dropdown placement="bottomRight" :trigger="['hover']">
                                <a-button class="!border-none !mr-0" size="small">
                                    <i class="fas fa-ellipsis-h" />
                                </a-button>
                                <a-menu slot="overlay" class="!w-40">
                                    <a-menu-item @click="() => { $refs.dialog.open(data) }">
                                        Chỉnh sửa
                                    </a-menu-item>
                                    <a-menu-item
                                        class="!text-danger-100"
                                        @click="() => {
                                            $refs.ConfirmDialog.open()
                                        }"
                                    >
                                        Xóa
                                    </a-menu-item>
                                </a-menu>
                            </a-dropdown>
                        </div>
                    </div>
                    <div class="bg-[#f2f2f2] rounded-md p-3 comment-content w-fit">
                        <div v-html="data?.content" />
                    </div>
                </div>
            </div>
        </div>
        <ConfirmDialog
            ref="ConfirmDialog"
            title="Xóa bản ghi"
            content="Bạn chắc chắn xóa bản ghi này ?"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';

    export default {
        components: {
            ConfirmDialog,
        },
        props: {
            data: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                visible: false,
                loading: false,
                form: {
                    createdAt: '2024-02-24T15:26:22.750Z',
                    auth: 'Trần Tuấn Anh',
                    content: '<h2>Báo cáo tình hình sức khoẻ ca đêm ngày 15/01/2024 của bé Phạm Minh Châu:</h2> <ul> <li><strong>Tên bé:</strong> Phạm Minh Châu</li> <li><strong>Ngày sinh:</strong> 07/07/2023</li> <li><strong>Tuổi:</strong> 6 tháng</li> <li><strong>Chiều cao:</strong> (Chưa được cung cấp)</li> <li><strong>Cân nặng:</strong> 7,7 kg</li> <li><strong>Nhiệt độ cơ thể:</strong> Bình thường</li> <li><strong>Sinh hoạt:</strong> Theo nhu cầu của bé</li> <li><strong>Cữ ăn:</strong> <ul> <li>10h20: Sữa mẹ (SM): 90ml</li> <li>12h40: Sữa mẹ (SM): 120ml</li> <li>16h55: Sữa mẹ (SM): 120ml</li> </ul> </li> <li><strong>Tình trạng sau khi ăn:</strong> Con khó vào giấc sau mỗi cữ ăn.</li> <li><strong>Tập vận động và kỹ năng:</strong> Không có thông tin về việc bé tập vận động và phát triển kỹ năng.</li> <li><strong>Tiêm chủng:</strong> Thông tin về tiêm chủng chưa được cung cấp.</li> <li><strong>Lưu ý:</strong> Sức khoẻ của bé ổn định.</li> </ul>',
                },
            };
        },
        computed: {
            ...mapState('health-book', ['healthBook']),
        },
        methods: {
            async confirmDelete() {
                try {
                    await this.$api.healthBooks.deleteComment(this.data._id);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('health-book/fetchComment', {
                        ...this.$route.query,
                        targetId: this.healthBook._id,
                    });
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },

    };
</script>
<style lang="scss">
.comment-content {
    p {
        margin: 0 !important
    };
}
</style>
