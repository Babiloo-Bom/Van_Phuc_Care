<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :centered="true"
        :title="handlerTitle(type)"
    >
        <div class="min-h-[200px]">
            <a-input v-model="inputValue" clear-icon />
            <div v-if="!loading">
                <a-button
                    v-if="inputValue && !handleSearch().length"
                    type="link"
                    class="!flex items-center gap-2 cursor-pointer mt-1 !p-0"
                    :disabled="true"
                    @click="addTag"
                >
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM8 12h8M12 16V8"
                        stroke="#53c66e"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                    <span>{{ 'Thêm tag' }} "{{ inputValue }}"</span>
                </a-button>
                <div class="mt-2">
                    <a-checkbox-group
                        v-if="tagsCustomer?.length"
                        v-model="form.tagSelecteds"
                        :style="radioStyle"
                        :options="handleSearch()?.map(e => ({
                            value: JSON.stringify({_id:e._id, name: e.name}),
                            label: e.name,
                        }))"
                    />
                    <a-empty v-else />
                </div>
            </div>
            <div v-else class="flex items-center justify-center h-[155px]">
                <div class="race-by " />
            </div>
        </div>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="close">
                {{ 'Hủy' }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                type="primary"
                :disabled="!form.tagSelecteds?.length"
                @click="submit"
            >
                {{ type !== 'add' ? `Cập nhật` : `Tạo mới` }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    // import _omit from 'lodash/omit';
    // import debounce from 'lodash/debounce';

    const defaultForm = {
        tagSelecteds: [],
    };
    export default {
        props: {
            title: {
                type: String,
                default: 'shared.save',
            },
            content: String,
            confirmBtn: {
                type: String,
                default: 'other.save',
            },
            confirmIcon: String,
            confirmBtnType: {
                type: String,
                default: 'primary',
            },
            cancelBtn: {
                type: String,
                default: 'shared.cancel',
            },
        },
        data() {
            return {
                visible: false,
                loading: false,
                form: defaultForm,
                inputValue: '',
                rules: {
                },
                radioStyle: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    flexDirection: 'column',
                    gap: '12px',
                },
                type: 'add',
            };
        },
        computed: {
            ...mapState('customers', ['customerSelected']),
            ...mapState('tags', ['tagsCustomer']),
        },

        methods: {
            ...mapActions('customers', ['selectedCustomer']),
            async open(data, type) {
                this.form = data ? _cloneDeep({
                    ...data,
                    tagSelecteds: data.tagSelecteds?.map((e) => JSON.stringify({ _id: e._id, name: e.name })),
                }) : defaultForm;
                this.type = type;
                this.visible = true;
                this.loading = true;
                this.loading = false;
                console.log(this.form);
            },

            close() {
                this.visible = false;
            },

            handlerTitle(type) {
                if (type === 'add') {
                    return `Tag ${this.customerSelected.length} khách hàng`;
                } if (type === 'remove') {
                    return `Xóa ${this.customerSelected.length} khách hàng`;
                }
                return 'Chỉnh sửa tags';
            },

            handleSearch() {
                return this.tagsCustomer?.filter((e) => (this.inputValue ? e.name.toLowerCase().includes(this.inputValue.toLowerCase()) : e));
            },
            async addTag() {
                this.loading = true;
                const tag = await this.$api.tags.create({
                    name: this.inputValue,
                    type: 'customer',
                });
                this.form.tagSelecteds = [...this.form.tagSelecteds, { _id: tag._id, name: tag.name }];
                this.inputValue = '';
                this.loading = false;
            },
            async submit() {
                try {
                    const tags = this.form.tagSelecteds.map((e) => JSON.parse(e));
                    await this.$api.customers.bulkUpdate({
                        action: this.type,
                        data: this.customerSelected,
                        tags,
                    });
                    this.$message.success('Cập nhật thành công');
                    this.form.tagSelecteds = [];
                    this.selectedCustomer([]);
                    if (this.type === 'edit') {
                        this.$store.dispatch('customers/fetchDetail', this.$route.params.id);
                    }
                    this.close();
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
        },
    };
</script>

<style lang="scss">
.inport-user {
    .ant-upload {
        @apply w-full;
    }
}
</style>
