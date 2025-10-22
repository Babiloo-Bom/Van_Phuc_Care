<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        centered
        :width="800"
        :title="form._id ? 'Cập nhật thông tin' : 'Tạo hợp đồng'"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :colon="false"
            :rules="rules"
        >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ,b-4">
                <div class="mb-3 col-span-2">
                    <p class="m-0 font-[600] text-[#000] mb-1 ">
                        Khách hàng
                    </p>
                    <a-input
                        v-model="form.email"
                        placeholder="Nhập Email khách hàng"
                        class=""
                    />
                </div>
                <div class="mb-3">
                    <p class="m-0 font-[600] text-[#000] mb-1 ">
                        Chọn dịch vụ
                    </p>
                    <a-select v-model="form.serviceId">
                        <a-select-option v-for="(service, index) in services" :key="`service._id_${index}`" :value="service._id">
                            {{ service.title }}
                        </a-select-option>
                    </a-select>
                </div>
                <div class="mb-3">
                    <p class="m-0 font-[600] text-[#000] mb-1 ">
                        Số buổi sử dụng còn lại
                    </p>
                    <a-input
                        v-model="form.numberDayRemain"
                        placeholder="Nhập Số buổi sử dụng còn lại của khách hàng"
                        class=""
                    />
                </div>
            </div>
            <LectureForm
                ref="LectureForm"
                :lecture="$route.params.id === 'tao-moi' ? null : form?.implementer"
                @submit="(form) => lectureEmit = form"
            />
            <ContractRef
                ref="ContractRef"
                :file-prop="form.contract"
                @submit="(form) => contractEmit = form"
            />
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="px-2"
                type="primary"
                @click="submit"
            >
                {{ form._id ? "Cập nhật" : "Tạo mới" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import { mapState } from 'vuex';
    import _omit from 'lodash/omit';
    import {
        convertToFormData,
    } from '@/utils/form';
    import LectureForm from '@/components/services/Lectures.vue';
    import ContractRef from '@/components/services/Contract.vue';

    export default {
        components: {
            LectureForm,
            ContractRef,
        },
        props: {
        },
        data() {
            return {
                previewVisible: false,
                visible: false,
                loading: false,
                room: null,
                form: {
                    _id: '',
                    email: '',
                },
                lectureEmit: null,
                contractEmit: null,
                rules: {
                    email: [
                        {
                            required: true,
                            message: 'Vui lòng nhập email',
                            trigger: 'blur',
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: 'Vui lòng nhập mật khẩu',
                            trigger: 'blur',
                        },
                    ],
                },
            };
        },

        computed: {
            ...mapState('services', ['services']),
        },

        methods: {
            _isEmpty,
            async open(data) {
                try {
                    if (!this.services.length) {
                        await this.$store.dispatch('services/fetchAll', { ...this.$route.query });
                    }
                    this.form = {
                        ...data,
                    };
                    console.log(data);
                    this.visible = true;
                } catch {
                    this.$$message.error('Đã có lỗi xảy ra');
                }
            },

            close() {
                this.visible = false;
            },

            async submit() {
                try {
                    this.loading = true;
                    this.$refs.LectureForm.submit();
                    this.$refs.ContractRef.submit();
                    const { form: lecturesForm } = this.lectureEmit;

                    const { avatarFile } = this.lectureEmit;
                    const { contract } = this.contractEmit;

                    const uploadAvatarPromise = avatarFile
                        ? this.$api.uploader.uploadFile(convertToFormData({ files: avatarFile }))
                        : Promise.resolve({ data: { fileAttributes: [] } });

                    const uploadContractPromise = contract
                        ? this.$api.uploader.uploadFile(convertToFormData({ files: contract }))
                        : Promise.resolve({ data: { fileAttributes: [] } });

                    const [avatarResponse, contractResponse] = await Promise.all([uploadAvatarPromise, uploadContractPromise]);
                    const _data = { implementer: lecturesForm };
                    if (avatarResponse.data.fileAttributes.length > 0) {
                        _data.implementer.avatar = avatarResponse.data.fileAttributes[0]?.source;
                    }

                    if (contractResponse.data.fileAttributes.length > 0) {
                        _data.contract = contractResponse.data.fileAttributes[0];
                    }
                    if (!this.form._id) {
                        await this.$api.registers.create({
                            ...this.form,
                            ..._data,
                            createdBy: {
                                _id: this.$auth.user._id,
                                fullname: this.$auth.user.fullname,
                            },
                        });
                        this.$message.success('Thêm thành công');
                    } else {
                        console.log(_omit({ ...{ ...this.form, ..._data }, implementer: _data.implementer }, ['_id', 'thumbnailFile']));
                        await this.$api.registers.update(this.form._id, _omit({ ...{ ...this.form, ..._data }, implementer: _data.implementer }, ['_id', 'thumbnailFile']));
                        this.$message.success('Cập nhật thành công');
                    }
                    await this.$store.dispatch('registers/fetchAll', { ...this.$route.query });
                } catch (e) {
                    this.$message.error(e);
                } finally {
                    this.loading = false;
                    this.visible = false;
                }
            },
        },
    };
</script>
