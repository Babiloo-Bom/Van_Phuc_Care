<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="'Chi tiết lịch khám'"
    >
        <div>
            <h5 class="text-[18px]">
                {{ record.fullname }}
            </h5>
            <a-divider orientation="left">
                Mô tả & vấn đề:
            </a-divider>
            <p>
                {{ record.symptom }}
            </p>
            <a-divider orientation="left">
                Hình ảnh chi tiết
            </a-divider>
            <div class="">
                <a-empty />
            </div>
        </div>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Đóng
            </a-button>
            <!-- <a-button
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(record) ? "Cập nhật" : "Thay đổi" }}
            </a-button> -->
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _omit from 'lodash/omit';

    export default {
        components: {
        },
        props: {
            record: {
                type: Object,
                default: () => {},
            },
        },
        data() {
            return {
                previewVisible: false,
                previewImage: '',
                visible: false,
                loading: false,
                room: null,
                form: {
                    title: '',
                    link: '',
                    thumbnail: '',
                    desciption: '',
                    _id: '',
                },
                fileName: null,
            };
        },
        methods: {
            _isEmpty,
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },
            openSelectFile() {
                document.querySelector('#thumbnailImage').click();
            },

            previewThumbnail() {
                const imageSelect = document.querySelector('#thumbnailImage').files[0];
                this.fileName = imageSelect.name;
                this.form.thumbnail = URL.createObjectURL(imageSelect);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.fileName) {
                                await this.handlerThumbnail();
                            }
                            if (!this.form._id) {
                                await this.$api.banners.create({ ...this.form, status: 'active' });
                                this.$message.success('Thêm thành công');
                            } else {
                                await this.$api.banners.update(this.form._id, _omit(this.form, ['_id']));
                                this.$message.success('Sửa thành công');
                            }
                            this.close();
                            await this.$store.dispatch('banners/fetchAll', this.$route.query);
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            this.loading = false;
                        }
                    }
                });
            },
        },
    };
</script>
