<template>
    <div v-if="!loading" class="max-w-[1200px] !mx-auto w-full block p-3 detail-customer">
        <div v-if="emptyData" class="flex-col gap-4 flex items-center justify-center h-full">
            <a-empty :description="false" />
            <h4 class="text-[20px] font-bold text-center">
                Không tìm thấy dữ liệu
            </h4>
        </div>
        <div v-else>
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <h4 class="m-0 text-[20px] font-bold">
                        {{ `Bé ${healthBook?.name|| ''}` }}
                    </h4>
                    <div class="flex items-center justify-center gap-4">
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
            <div class="pl-10">
                <span v-if="healthBook?.address" class="text-[12px] text-[#616161]">{{ healthBook?.address }} - </span>
                <span class="text-[12px] text-[#616161]">Cập nhật lần cuối: {{ healthBook?.updatedAt | dateFormat('HH:mm dd/MM/yyyy') }}</span>
            </div>
            <div class="grid grid-cols-12 mt-4 gap-5">
                <div class="card col-span-8">
                    <div class="">
                        <vue-editor v-model="comment" :editor-toolbar="customToolbar" />
                        <div class="flex items-center justify-end">
                            <a-button
                                :loading="loadingSend"
                                type="primary"
                                class="!mt-2"
                                @click="submit()"
                            >
                                <svg
                                    v-if="!loadingSend"
                                    class="transition-all duration-300"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                ><path
                                    d="m9.51 4.23 8.56 4.28c3.84 1.92 3.84 5.06 0 6.98l-8.56 4.28c-5.76 2.88-8.11.52-5.23-5.23l.87-1.73c.22-.44.22-1.17 0-1.61l-.87-1.74C1.4 3.71 3.76 1.35 9.51 4.23ZM5.44 12h5.4"
                                    stroke="#fff"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                /></svg>
                            </a-button>
                        </div>
                    </div>
                    <div class="mb-4 mt-4 pt-4 border-t-[1px] border-[#f2f2f2]">
                        <Comments v-for="record in comments" :key="`comments_${record._id}`" :data="record" />
                    </div>
                </div>
                <div class="col-span-4">
                    <div class="card">
                        <div class="flex items-center justify-between">
                            <h4 class="m-0 text-[14px] font-[600]">
                                {{ 'Thông tin' }}
                            </h4>
                            <a-button type="text" class="!p-0 !w-[23px] flex items-center justify-center !h-[23px] !border-0 back !bg-[transparent]" @click="editInfors(healthBook)">
                                <svg
                                    viewBox="0 0 20 20"
                                    class="!m-0 w-[23px] h-[23px]"
                                    focusable="false"
                                    aria-hidden="true"
                                ><path fill="#8e8e8e" fill-rule="evenodd" d="M15.655 4.344a2.695 2.695 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.008.01-5.88 5.88a2.75 2.75 0 0 0-.805 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.539a2.695 2.695 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88-1.689-1.69Zm2.75.629.599-.599a1.195 1.195 0 1 0-1.69-1.689l-.598.599 1.69 1.689Z" /></svg>
                            </a-button>
                        </div>
                        <div class="pt-4 mt-1" style="border-top: 1px solid #ced4da">
                            <p>Ngày sinh: {{ healthBook.dob }}</p>
                            <p>Cân nặng: {{ healthBook.weight }} kg</p>
                            <p>Chiều dài: {{ healthBook.height }} cm</p>
                            <p>{{ 'Giới tính' }}: {{ healthBook.gender ? (healthBook.gender === 'male' ? 'Nam' : 'Nữ') : 'Khác' }}</p>
                        </div>
                        <div class="pt-4 mt-1" style="border-top: 1px solid #ced4da">
                            <p class="m-0">
                                {{ 'Lưu ý' }}: <span v-if="healthBook.note" v-html="healthBook.note" /> <span v-else>Trống</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDialog
                ref="confirmDelete"
                title="Xóa bản ghi"
                content="Bạn chắc chắn xóa bản ghi này?"
                @confirm="confirmDelete"
            />
            <Dialog ref="dialog" />
        </div>
    </div>
    <div v-else class="flex items-center justify-center h-full">
        <div class="race-by " />
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import { VueEditor } from 'vue2-editor';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import Dialog from '@/components/health-books/Dialog.vue';
    import Comments from '@/components/health-books/Comments.vue';

    export default {
        layout: 'account',
        components: {
            ConfirmDialog,
            Dialog,
            Comments,
            VueEditor,
        },
        async fetch() {
            await this.fetchData();
            this.fetchComment();
        },
        data() {
            return {
                loading: false,
                loadingSend: false,
                loadingComment: false,
                emptyData: false,
                loadingSave: false,
                loadingTimeline: false,
                comment: '',
                form: {
                },
                customToolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['image', 'code-block'],
                ],
                data: [],
                options: [],
                totalSpent: 0,
            };
        },
        computed: {
            ...mapState('health-book', ['healthBook', 'healthBookSelected', 'comments']),
        },
        watch: {
            '$route.query': {
                handler() {
                    this.fetchData();
                },
            },
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Chi tiết Sổ sức khỏe',
                link: `/health-books/${this.healthBookSelected._id}`,
            }]);
        },

        methods: {
            ...mapActions('health-book', ['selectedHealthBook']),
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('health-book/fetchDetail', this.$route.params.id);
                } catch (error) {
                    this.emptyData = true;
                } finally {
                    this.loading = false;
                }
            },
            async fetchComment() {
                try {
                    this.loadingComment = true;
                    await this.$store.dispatch('health-book/fetchComment', {
                        ...this.$route.query,
                        targetId: this.healthBook._id,
                    });
                } catch (error) {
                    this.emptyData = true;
                } finally {
                    this.loadingComment = false;
                }
            },
            async fetchSchedules() {
                try {
                    this.loading = true;
                    if (!this.schedules?.length) {
                        await this.$store.dispatch('health-book/fetchAll');
                    }
                } catch (error) {
                    this.emptyData = true;
                } finally {
                    this.loading = false;
                }
            },
            async editInfors(data) {
                this.$refs.dialog.open(data);
            },
            async confirmDelete() {
                try {
                    await this.$api.customers.delete(this.customer._id);
                    this.$message.success('Xóa thành công');
                    await this.$store.dispatch('health-book/fetchAll', { ...this.$route.query });
                    this.$router.push('/khach-hang');
                } catch (e) {
                    this.$handleError(e);
                }
            },
            async handleClose(tag) {
                this.$store.dispatch('health-book/update', {
                    _id: this.$route.params.id,
                    data: {
                        tags: this.customer.tags.filter((e) => e.name !== tag.name),
                    },
                });
            },

            async submit() {
                try {
                    this.loadingSend = true;
                    await this.$api.healthBooks.createComment({
                        content: this.comment,
                        targetId: this.healthBook._id,
                    });
                    this.comment = '';
                    await this.fetchComment();
                } catch (e) {
                    this.$handleError(e);
                } finally {
                    this.loadingSend = false;
                }
            },

        },

        head() {
            return {
                title: 'Chi tiết sổ sức khỏe',
            };
        },
    };
</script>
<style lang="scss">
.detail-customer {
    button.back:hover {
        background-color: #e3e3e3 !important;
    }
}
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
.ql-editor {
    min-height: fit-content !important;
}
.ql-toolbar.ql-snow+.ql-container.ql-snow {
}
.quillWrapper .ql-snow.ql-toolbar {
    padding-top: 4px !important;
}
.quillWrapper .ql-snow.ql-toolbar .ql-formats {
    margin-bottom: 0 !important;
}
</style>
