<template>
    <div v-if="!loading">
        <div class="flex items-center justify-start gap-3">
            <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/dich-vu')">
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
                        {{ $route.params.id ==='tao-moi' ? 'Tạo dịch vụ mới' : service.title }}
                    </h4>
                    <a-switch
                        :default-checked="service.status === 'active'"
                        @click="updateShowService(service)"
                        @change="onChangeShowService"
                    />
                </div>
                <div class="flex items-center gap-3">
                    <nuxt-link to="/tin-tuc/bai-viet">
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
                        {{ $route.params.id ==='tao-moi' ? 'Tạo mới' : 'Cập nhật' }}
                    </a-button>
                    <a-button type="text" class="!p-1 !w-[31px] flex items-center justify-center !h-[31px] !border-0 back !bg-[transparent]" @click="$refs.confirmDelete.open()">
                        <svg
                            viewBox="0 0 20 20"
                            class="!m-0 w-[23px] h-[23px]"
                            focusable="false"
                            aria-hidden="true"
                        ><path fill="#8e8e8e" d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" /><path fill="#8e8e8e" d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" /><path fill="#8e8e8e" fill-rule="evenodd" d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z" /></svg>
                    </a-button>
                </div>
            </div>
        </div>

        <div class="mt-4 card-container">
            <a-tabs default-active-key="1" type="card" @change="changeTab">
                <a-tab-pane key="1" tab="Thông tin chung" force-render>
                    <ServiceForm
                        ref="ServiceForm"
                        :editor-status="editorStatus"
                        :service="$route.params.id === 'tao-moi' ? null : service"
                        @submit="(form) => serviceEmit = form"
                    />
                </a-tab-pane>
                <!-- <a-tab-pane key="2" tab="Người thực hiện" force-render>
                    <LectureForm
                        ref="LectureForm"
                        :lecture="$route.params.id === 'tao-moi' ? null : service?.implementer"
                        @submit="(form) => lectureEmit = form"
                    />
                </a-tab-pane> -->
                <a-tab-pane key="3" tab="Chi tiết liệu trình">
                    <Progress :data="service.progress || []" />
                </a-tab-pane>
                <a-tab-pane key="4" tab="Gói dịch vụ">
                    <Pricings :data="service.pricings || []" />
                </a-tab-pane>
                <!-- <a-tab-pane key="5" tab="Hợp đồng" force-render>
                    <ContractRef
                        ref="ContractRef"
                        :file-prop="service.contract"
                        @submit="(form) => contractEmit = form"
                    />
                </a-tab-pane> -->
                <a-tab-pane key="6" tab="Câu hỏi thường gặp">
                    <Faqs :loading="loadingFaqs" />
                </a-tab-pane>
                <a-tab-pane key="7" tab="Đánh giá">
                    <Feedbacks :loading="loadingFeedback" />
                </a-tab-pane>
            </a-tabs>
        </div>
        <ConfirmDialog
            ref="confirmDelete"
            title="Xóa bản ghi"
            content="Bạn chắc chắn xóa bản ghi này?"
            @confirm="confirmDelete"
        />
    </div>
    <div v-else class="flex items-center justify-center h-full min-h-[450px]">
        <span class="genstech-loader" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import {
        convertToFormData,
    } from '@/utils/form';
    import ServiceForm from '@/components/services/Form.vue';
    import Faqs from '@/components/services/Faqs.vue';
    import Feedbacks from '@/components/services/Feedbacks.vue';
    import Pricings from '@/components/services/Pricings.vue';
    import Progress from '@/components/services/Progress.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    // import LectureForm from '@/components/services/Lectures.vue';
    // import ContractRef from '@/components/services/Contract.vue';
    import _omit from 'lodash/omit';

    export default {
        components: {
            ServiceForm,
            ConfirmDialog,
            Faqs,
            Feedbacks,
            Pricings,
            Progress,
            // LectureForm,
            // ContractRef,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                loadingFeedback: false,
                loadingFaqs: false,
                editorStatus: false,
                lecturesForm: {},
                serviceForm: {},

                serviceEmit: null,
                lectureEmit: null,
                contractEmit: null,
            };
        },

        computed: {
            ...mapState('services', ['service']),
            ...mapState('faqs', ['faqs']),
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Chi tiết dịch vụ',
                link: '/dich-vu',
            }]);
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.$route.params.id !== 'tao-moi') {
                        await this.$store.dispatch('services/fetchDetail', this.$route.params.id);
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },

            async fetchFeedbacks() {
                try {
                    this.loadingFeedback = true;
                    await this.$store.dispatch('feedbacks/fetchAll', {
                        serviceId: this.service._id,
                    });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingFeedback = false;
                }
            },

            async fetchFaqs() {
                try {
                    this.loadingFaqs = true;
                    await this.$store.dispatch('faqs/fetchAll', {
                        serviceId: this.service._id,
                    });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingFaqs = false;
                }
            },

            async confirmDelete() {
                try {
                    await this.$api.services.delete([this.service._id]);
                    this.$message.success('Xóa dịch vụ thành công');
                    await this.$store.dispatch('services/fetchAll', { ...this.$route.query });
                    this.$router.push('/dich-vu');
                } catch (e) {
                    this.$handleError(e);
                }
            },

            async submitForm() {
                try {
                    this.$refs.ServiceForm.submit();
                    this.$refs.LectureForm.submit();
                    this.$refs.ContractRef.submit();

                    const serviceForm = this.serviceEmit;
                    const { form: lecturesForm } = this.lectureEmit;

                    const { thumbnailFile } = this.serviceEmit;
                    const { avatarFile } = this.lectureEmit;
                    const { contract } = this.contractEmit;

                    this.loading = true;
                    const _data = { ...serviceForm, implementer: { ...lecturesForm } };

                    const uploadThumbnailPromise = thumbnailFile
                        ? this.$api.uploader.uploadFile(convertToFormData({ files: thumbnailFile }))
                        : Promise.resolve({ data: { fileAttributes: [] } });

                    const uploadAvatarPromise = avatarFile
                        ? this.$api.uploader.uploadFile(convertToFormData({ files: avatarFile }))
                        : Promise.resolve({ data: { fileAttributes: [] } });

                    const uploadContractPromise = contract
                        ? this.$api.uploader.uploadFile(convertToFormData({ files: contract }))
                        : Promise.resolve({ data: { fileAttributes: [] } });

                    const [thumbnailResponse, avatarResponse, contractResponse] = await Promise.all([uploadThumbnailPromise, uploadAvatarPromise, uploadContractPromise]);

                    if (thumbnailResponse.data.fileAttributes.length > 0) {
                        _data.thumbnail = thumbnailResponse.data.fileAttributes[0]?.source;
                    }

                    if (avatarResponse.data.fileAttributes.length > 0) {
                        _data.implementer.avatar = avatarResponse.data.fileAttributes[0]?.source;
                    }

                    if (contractResponse.data.fileAttributes.length > 0) {
                        _data.contract = contractResponse.data.fileAttributes[0]?.source;
                    }

                    if (!this.service._id) {
                        await this.$api.services.create(_data);
                        this.$message.success('Thêm dịch vụ thành công');
                    } else {
                        await this.$api.services.update(this.service._id, _omit({ ..._data, implementer: _data.implementer }, ['_id', 'thumbnailFile']));
                        this.$message.success('Cập nhật dịch vụ thành công');
                    }
                    this.$router.push('/dich-vu');
                } catch (e) {
                    this.$message.error(this.$route.params.id === 'tao-moi' ? e.response?.data?.error : 'Cập nhật thất bại');
                } finally {
                    this.loading = false;
                }
            },
            changeTab(value) {
                if (value === '6') {
                    this.fetchFaqs();
                } else if (value === '7') {
                    this.fetchFeedbacks();
                }
                this.editorStatus = false;
                setTimeout(() => {
                    this.editorStatus = true;
                }, 10);
            },
            async updateShowService() {
                try {
                    this.$api.services.update(this.service._id, { status: this.status ? 'active' : 'inactive' });
                } catch (e) {
                    this.$handleError(e);
                }
            },
            onChangeShowService(value) {
                this.status = value;
            },
        },

        head() {
            return {
                title: 'Dịch vụ',
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
