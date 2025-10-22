<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        width="800px"
        :title="_isEmpty(record) ? 'Tạo ticket' : `Ticket ${form._id}`"
    >
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
            :colon="false"
        >
            <div class="grid grid-cols-1 gap-4">
                <div>
                    <h5 class="m-0 font-[600]">
                        Khách hàng:
                    </h5>
                    <div v-if="form._id && form.customer" class="mt-1 flex items-center justify-start gap-2">
                        <div>
                            <a-avatar
                                v-if="form.customer.avatar"
                                :src="form.customer.avatar"
                                alt=""
                                class="rounded-full w-16 h-16 object-cover"
                            />
                            <a-avatar v-else class="rounded-full w-16 h-16 object-cover uppercase">
                                {{ form.customer.email.charAt(0) }}
                            </a-avatar>
                        </div>
                        <span>{{ form.customer.email }}</span>
                    </div>
                    <div v-else class="mt-1">
                        <a-input v-model="form.customerEmail" placeholder="Nhập email khách hàng" />
                    </div>
                </div>
                <div class="">
                    <h5 class="m-0 font-[600]">
                        Vấn đề cần hỗ trợ:
                    </h5>
                    <div v-if="form.content && form._id" class=" content-tickets rounded-sm p-3 bg-[#f2f2f2] mt-2">
                        <div class="m-0 text-[#000]" v-html="form.content" />
                    </div>
                    <div v-else class="mt-2">
                        <vue-editor v-model="form.content" />
                    </div>
                </div>
                <div>
                    <img
                        v-for="(file, index) in form.files"
                        :key="`file_${index}`"
                        :src="file.source"
                        :alt="file.originalname"
                    >
                </div>
                <div v-if="form._id" class="">
                    <h5 class="m-0 font-[600] mb-1">
                        Phản hồi:
                    </h5>
                    <vue-editor v-model="form.reply" />
                </div>
                <div class="flex items-center justify-start gap-6">
                    <div class="flex items-center justify-start gap-4 opacity-50 cursor-none">
                        <p class="m-0">
                            Thông báo qua Email
                        </p>
                        <a-switch :default-checked="false" />
                    </div>
                    <div class="">
                        <a-button class="!rounded-full !bg-[#1351d8]" type="primary">
                            Upgrade
                        </a-button>
                    </div>
                </div>
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                v-if="form._id"
                :loading="loading"
                class="px-2"
                type="primary"
                :disabled="!form.reply"
                @click="submit"
            >
                {{ 'Phản hồi' }}
            </a-button>
            <a-button
                v-else
                :loading="loading"
                class="px-2"
                type="primary"
                :disabled="!form.content"
                @click="submit"
            >
                {{ 'Tạo ticket' }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import _isEmpty from 'lodash/isEmpty';
    import _omit from 'lodash/omit';
    import _cloneDeep from 'lodash/cloneDeep';
    import { VueEditor } from 'vue2-editor';

    const defaultForm = {
        status: 'active',
    };

    export default {
        components: {
            VueEditor,
        },
        data() {
            return {
                visible: false,
                loading: false,
                form: this.record ? _cloneDeep(this.record) : _cloneDeep(defaultForm),
                rules: {
                },
                genders: [
                    { label: 'Nam', value: 'male' },
                    { label: 'Nữ', value: 'female' },
                    { label: 'Khác', value: null },
                ],
                record: null,
                thumbnailFile: null,
            };
        },

        watch: {
            record() {
                this.form = this.record ? _cloneDeep(this.record) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,
            open(record) {
                this.record = record;
                console.log(record);
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            handlerThumbnail(file) {
                this.thumbnailFile = file;
                this.form.avatar = URL.createObjectURL(file);
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (this.form._id) {
                                await this.$api.tickets.update(this.form._id, _omit({
                                    ...this.form,
                                    status: 'done',
                                }, ['_id']));
                            } else {
                                await this.$api.tickets.create({
                                    ...this.form,
                                    status: 'process',
                                });
                            }
                            await this.$store.dispatch('tickets/fetchDetail', this.$route.params.id);
                            this.$message.success('Đã phản hồi');
                            this.close();
                            await this.$store.dispatch('tickets/fetchAll', { ...this.$route.query });
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
<style lang="scss">
.ql-snow .ql-toolbar button svg, .quillWrapper .ql-snow.ql-toolbar button svg {
    width: 16px !important;
    height: 16px !important;
}
.ql-toolbar.ql-snow {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
}
.ql-container.ql-snow {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
}
.ql-toolbar.ql-snow+.ql-container.ql-snow {
}
.quillWrapper .ql-snow.ql-toolbar {
    padding-top: 4px !important;
}
.quillWrapper .ql-snow.ql-toolbar .ql-formats {
    margin-bottom: 0 !important;
}
.content-tickets {
    p {
        margin: 0 !important;
    }
}
</style>
