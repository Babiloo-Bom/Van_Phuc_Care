<template>
    <div class="flex gap-4">
        <div class="min-w-[200px] card">
            <a-button
                v-for="tab in tabs"
                :key="`tab_${tab.value}`"
                :type="`${tab.value === activeKey ? 'primary': ''}`"
                class="!flex !w-full items-center justify-start gap-1 !border-none mb-3"
                @click="changeTab(tab.value)"
            >
                <span v-html="tab.icon" />
                <p class="m-0 !font-[400]">
                    {{ tab.label }}
                </p>
            </a-button>
        </div>
        <div class="w-full card">
            <div class="flex items-end justify-between">
                <FileFilters />
                <a-button type="primary" class="" @click="$refs.createModal.open({folder: activeKey})">
                    Thêm thư mục
                </a-button>
            </div>
            <div v-if="folders.length" class="flex items-center flex-start gap-4 mt-4 pt-4 border-t-[1px] border-[#e8e8e8]">
                <div v-for="folder in folders" :key="`folders_${folder._id}`" class="min-w-[200px] border-[1px] rounded-sm border-[#e8e8e8] p-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-1">
                            <img class="w-10 h-10" src="/images/folder.svg" alt="/">
                            <nuxt-link :to="`/documents/${folder._id}${queryString}`">
                                <h6 class="m-0">
                                    {{ folder.name }}
                                </h6>
                            </nuxt-link>
                        </div>
                        <a-dropdown placement="bottomRight" :trigger="['hover']">
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="cursor-pointer"
                            ><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                            <a-menu slot="overlay" class="!w-40">
                                <a-menu-item
                                    @click="() => {
                                        selected = folder; $refs.createModal.open(folder)
                                    }"
                                >
                                    Sửa
                                </a-menu-item>
                                <a-menu-item
                                    class="!text-danger-100"
                                    @click="() => {
                                        selected = folder; $refs.confirmDelete.open(folder) }"
                                >
                                    Xóa
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </div>
                    <div class="flex items-center justify-start mt-2 gap-1">
                        <p class="m-0 text-[11px] text-[#8094ae]">
                            {{ moment(folder.updatedAt).format('DD/MM/YYYY') }}
                        </p>
                        <div class="w-[2px] h-[2px] rounded-full bg-[#8094ae]" />
                        <p class="m-0 text-[11px] text-[#8094ae]">
                            {{ folder.size || 0 }}MB
                        </p>
                        <!-- <div class="w-[2px] h-[2px] rounded-full bg-[#8094ae]" />
                        <p class="m-0 text-[11px] text-[#8094ae]">
                            {{ '3 thành viên' }}
                        </p> -->
                    </div>
                </div>
            </div>
            <div v-else class="flex items-center justify-center h-full">
                <a-empty description="Chưa có dữ liệu" />
            </div>
        </div>
        <ConfirmDialog
            ref="confirmDelete"
            title="Xóa bản ghi"
            content="Bạn chắc chắn xóa bản ghi này ?"
            @confirm="confirmDelete"
        />
        <Modal ref="createModal" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { mapDataFromOptions } from '@/utils/data';
    import FileFilters from '@/components/files/Filter.vue';
    import Modal from '@/components/files/CreateModal.vue';
    import ConfirmDialog from '@/components/shared/ConfirmDialog.vue';
    import moment from 'moment';

    export default {
        components: {
            FileFilters,
            Modal,
            ConfirmDialog,
        },

        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                loading: false,
                loadingTable: false,
                search: false,
                selected: '',
                activeKey: 'my',
                tabs: [
                    {
                        value: 'my',
                        label: 'Tài liệu của tôi',
                        icon: `<svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path d="M21.017 7.992c.398.566-.076 1.258-.769 1.258H3a1 1 0 0 1-1-1V6.42C2 3.98 3.98 2 6.42 2h2.32c1.63 0 2.14.53 2.79 1.4l1.4 1.86c.31.41.35.46.93.46h2.79c1.805 0 3.402.897 4.367 2.272ZM20.983 10.75a1 1 0 0 1 1 .997L22 16.65C22 19.6 19.6 22 16.65 22h-9.3C4.4 22 2 19.6 2 16.65v-4.9a1 1 0 0 1 1-1h17.983Z" fill="#1a77ba" /></svg>`,
                    },
                    {
                        value: 'shared',
                        label: 'Tài liệu chia sẻ',
                        icon: `<svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path d="M20.36 12.732c-.37 0-.68-.28-.72-.65a7.614 7.614 0 0 0-3.24-5.44.723.723 0 0 1-.18-1.01c.23-.33.68-.41 1.01-.18a9.115 9.115 0 0 1 3.86 6.48c.04.4-.25.76-.65.8h-.08ZM3.74 12.781h-.07a.73.73 0 0 1-.65-.8 9.083 9.083 0 0 1 3.8-6.49c.32-.23.78-.15 1.01.17.23.33.15.78-.17 1.01a7.632 7.632 0 0 0-3.19 5.45c-.04.38-.36.66-.73.66ZM15.99 21.1c-1.23.59-2.55.89-3.93.89-1.44 0-2.81-.32-4.09-.97a.715.715 0 0 1-.32-.97c.17-.36.61-.5.97-.33.63.32 1.3.54 1.98.67.92.18 1.86.19 2.78.03.68-.12 1.35-.33 1.97-.63.37-.17.81-.03.97.34.18.36.04.8-.33.97ZM12.05 2.012c-1.55 0-2.82 1.26-2.82 2.82 0 1.56 1.26 2.82 2.82 2.82 1.56 0 2.82-1.26 2.82-2.82 0-1.56-1.26-2.82-2.82-2.82ZM5.05 13.871c-1.55 0-2.82 1.26-2.82 2.82 0 1.56 1.26 2.82 2.82 2.82 1.56 0 2.82-1.26 2.82-2.82 0-1.56-1.27-2.82-2.82-2.82ZM18.95 13.871c-1.55 0-2.82 1.26-2.82 2.82 0 1.56 1.26 2.82 2.82 2.82 1.56 0 2.82-1.26 2.82-2.82 0-1.56-1.26-2.82-2.82-2.82Z" fill="#1a77ba" /></svg>`,
                    },
                    {
                        value: 'commons',
                        label: 'Tài liệu chung',
                        icon: `<svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path d="M9 2C6.38 2 4.25 4.13 4.25 6.75c0 2.57 2.01 4.65 4.63 4.74.08-.01.16-.01.22 0h.07a4.738 4.738 0 0 0 4.58-4.74C13.75 4.13 11.62 2 9 2ZM14.08 14.149c-2.79-1.86-7.34-1.86-10.15 0-1.27.85-1.97 2-1.97 3.23s.7 2.37 1.96 3.21c1.4.94 3.24 1.41 5.08 1.41 1.84 0 3.68-.47 5.08-1.41 1.26-.85 1.96-1.99 1.96-3.23-.01-1.23-.7-2.37-1.96-3.21ZM19.99 7.338c.16 1.94-1.22 3.64-3.13 3.87h-.05c-.06 0-.12 0-.17.02-.97.05-1.86-.26-2.53-.83 1.03-.92 1.62-2.3 1.5-3.8a4.64 4.64 0 0 0-.77-2.18 3.592 3.592 0 0 1 5.15 2.92Z" fill="#1a77ba" /><path d="M21.988 16.59c-.08.97-.7 1.81-1.74 2.38-1 .55-2.26.81-3.51.78.72-.65 1.14-1.46 1.22-2.32.1-1.24-.49-2.43-1.67-3.38-.67-.53-1.45-.95-2.3-1.26 2.21-.64 4.99-.21 6.7 1.17.92.74 1.39 1.67 1.3 2.63Z" fill="#1a77ba" /></svg>`,
                    },
                    {
                        value: 'bookmarks',
                        label: 'Đã đánh dấu',
                        icon: `<svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path d="m18.02 12.33-1.22-1.22a1.39 1.39 0 0 1-.47-1.03c-.02-.45.16-.9.49-1.23l1.2-1.2c1.04-1.04 1.43-2.04 1.1-2.83-.32-.78-1.31-1.21-2.77-1.21H5.9v-.86c0-.41-.34-.75-.75-.75s-.75.34-.75.75v18.5c0 .41.34.75.75.75s.75-.34.75-.75v-4.88h10.45c1.44 0 2.41-.44 2.74-1.23.33-.79-.05-1.78-1.07-2.81Z" fill="#1a77ba" /></svg>`,
                    },
                ],
            };
        },

        computed: {
            ...mapState('documents', ['folders', 'pagination']),
            queryString() {
                return window.location.search;
            },
        },

        watch: {
            '$route.query': {
                async handler() {
                    this.loadingTable = true;
                    await this.$store.dispatch('documents/fetchFolders', { ...this.$route.query });
                    this.loadingTable = false;
                    if (this.$route.query) {
                        this.search = true;
                    } else {
                        this.search = false;
                    }
                },
            },
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Quản lý tài liệu',
                link: '/documents',
            }]);
            this.activeKey = this.$route.query.folder;
        },

        methods: {
            moment,
            mapDataFromOptions,
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('documents/fetchFolders', { ...this.$route.query });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async changeTab(key) {
                this.activeKey = key;
                this.$router.push({
                    path: '/documents',
                    query: {
                        folder: key,
                    },
                });
            },
            async confirmDelete() {
                try {
                    await this.$api.documents.delete(this.selected._id);
                    this.$message.success('Xóa thành công');
                    this.fetchData();
                } catch (e) {
                    this.$handleError(e);
                }
            },
        },

        head() {
            return {
                title: 'Quản lý tài liệu',
            };
        },
    };
</script>
<style lang="scss">
.ant-btn-primary {
    svg, path {
        fill: #fff !important
    }
}
</style>
