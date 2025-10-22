<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="_isEmpty(pricing) ? 'Thêm mới gói dịch vụ' : 'Chỉnh sửa gói dịch vụ'"
    >
        <a-form-model
            ref="form"
            :model="form"
            layout="vertical"
            :colon="false"
        >
            <div class="grid grid-cols-1 gap-4">
                <a-form-model-item
                    prop="title"
                    label="Tiêu đề gói dịch vụ"
                >
                    <a-input
                        v-model="form.title"
                        placeholder="Nhập tiêu đề gói dịch vụ"
                    />
                </a-form-model-item>
                <a-form-model-item
                    prop="price"
                    label="Giá tiền"
                >
                    <a-input
                        v-model="form.price"
                        placeholder="Nhập tiêu giá tiền"
                    />
                </a-form-model-item>
                <Editor v-model="form.descriptions" title="Nội dung" />
            </div>
        </a-form-model>
        <div slot="footer" class="flex justify-center items-center gap-2">
            <a-button class="w-28" @click="close">
                Hủy bỏ
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                @click="submit"
            >
                {{ _isEmpty(pricing) ? "Thêm mới" : "Cập nhật" }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapState } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    import _isEmpty from 'lodash/isEmpty';
    import Editor from '@/components/shared/TinyEditor.vue';

    const defaultForm = {
        title: '',
        descriptions: '',
        price: '',
    };

    export default {
        components: {
            Editor,
        },

        props: {
        },

        data() {
            return {
                visible: false,
                loading: false,
                pricing: null,
                form: this.pricing ? _cloneDeep(this.pricing) : _cloneDeep(defaultForm),
                index: null,
            };
        },
        computed: {
            ...mapState('services', ['service']),
        },

        watch: {
            pricing() {
                this.form = this.pricing ? _cloneDeep(this.pricing) : _cloneDeep(defaultForm);
            },
        },

        methods: {
            _isEmpty,

            open(pricing, index) {
                this.pricing = pricing;
                this.visible = true;
                this.index = index;
            },

            close() {
                this.visible = false;
            },

            getContent(content) {
                this.form.descriptions = content;
            },

            async create(form) {
                try {
                    await this.$api.services.update(this.service._id, {
                        pricings: [
                            ...(this.service.pricings || []),
                            form,
                        ],
                    });
                    this.$message.success('Thêm mới gói dịch vụ thành công');
                } catch (error) {
                    this.$handleError(error);
                }
            },

            async update(form) {
                try {
                    const _data = _cloneDeep(this.service.pricings || []);
                    _data[this.index] = {
                        ...form,
                    };
                    await this.$api.services.update(this.service._id, {
                        pricings: [
                            ..._data,
                        ],
                    });
                    this.$message.success('Cập nhật gói dịch vụ thành công');
                } catch (error) {
                    this.$handleError(error);
                }
            },

            async submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        try {
                            this.loading = true;
                            if (_isEmpty(this.pricing)) {
                                await this.create(this.form);
                            } else {
                                await this.update(this.form);
                            }
                        } catch (error) {
                            this.$handleError(error);
                        } finally {
                            await this.$store.dispatch('services/fetchDetail', this.$route.params.id);
                            this.loading = false;
                            this.close();
                            this.form = {};
                        }
                    }
                });
            },
        },
    };
</script>
