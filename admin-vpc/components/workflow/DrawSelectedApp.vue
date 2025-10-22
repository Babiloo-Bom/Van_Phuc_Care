<template>
    <a-drawer
        class="workflow-selection"
        :visible="visible"
        :width="550"
        placement="right"
        @close="visible = false"
    >
        <div class="min-h-[65px] py-3 px-4">
            <div>
                <h6 class="m-0 font-bold text-[16px]">
                    {{ 'Select trigger' }}
                </h6>
            </div>
        </div>
        <div class="px-4">
            <div v-show="!appSelected">
                <div v-for="(item, idx) in sortedApps" :key="`app_${idx}`">
                    <div class="cursor-pointer flex items-center justify-between gap-3 px-3 py-3 border-b-[1px] border-[#dfe3e8] hover:bg-[#ececec] transition-all duration-150" @click="selectedApp(item)">
                        <div class="flex items-center gap-3">
                            <img class="w-8 h-8 rounded-sm" :src="item.logo" alt="/">
                            <div>
                                <h6 class="!m-0">
                                    {{ item.name }}
                                </h6>
                                <p class="!m-0 text-[12px] text-[#616161]">
                                    {{ item.descriptions }}
                                </p>
                            </div>
                        </div>
                        <svg
                            class="transition-all duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                        ><path
                            stroke="#000000"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-miterlimit="10"
                            stroke-width="1.5"
                            d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08"
                        /></svg>
                    </div>
                </div>
            </div>
            <div v-if="appSelected">
                <div class="rounded-md flex items-center justify-between gap-3 px-3 py-3 border-[1px] border-[#dfe3e8] bg-[#f8f7f7]">
                    <div class="flex items-center gap-3">
                        <a-button class="!flex items-center !gap-2 !min-w-7 !h-7 justify-center !p-0 !border-0 hover:!bg-[#0000000d]" type="text" @click="selectedApp(null)">
                            <svg
                                class="transition-all duration-300"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                            ><path
                                stroke="#8a8a8a"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-miterlimit="10"
                                stroke-width="1.5"
                                d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67"
                            /></svg>
                        </a-button>
                        <div class="flex items-center gap-4">
                            <img class="w-8 h-8 rounded-sm" :src="appSelected.logo" alt="/">
                            <div>
                                <h6 class="!m-0">
                                    {{ appSelected.name }}
                                </h6>
                                <p class="!m-0 text-[12px] text-[#6d7175] max-w-[285px] truncate">
                                    {{ appSelected.descriptions }}
                                </p>
                            </div>
                        </div>
                    </div>
                    <a-button type="primary" class="!bg-[#1351d8]" @click="$refs.dialogAPIKey.open(appSelected || {})">
                        Connect
                    </a-button>
                </div>
                <div class="rounded-md mt-4 border-[1px] border-[#dfe3e8] ">
                    <div v-for="(action, idx) in appSelected.actions" :key="action.value" @click="addAction(appSelected, action)">
                        <div :class="`${idx === 0 ? 'rounded-t-md' : '' } ${idx === appSelected.actions.length - 1 ? 'rounded-b-md' : '' } cursor-pointer flex items-center justify-between gap-3 px-3 py-3 bg-[#fff] hover:!bg-[#0000000d]`">
                            <div class="flex items-center gap-4">
                                <h6 class="!m-0">
                                    {{ action.label }}
                                </h6>
                                <p class="!m-0 text-[12px] text-[#6d7175] max-w-[285px] truncate">
                                    {{ action.descriptions }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DialogAPIKey
            ref="dialogAPIKey"
        />
    </a-drawer>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';
    import DialogAPIKey from '@/components/workflow/DialogAPIKey.vue';
    import { APP_LISTING } from '@/constants/workflows/app';

    export default {
        components: {
            DialogAPIKey,
        },

        props: {
        },

        data() {
            return {
                APP_LISTING,
                visible: false,
                loading: false,
                lesson: null,
                action: null,
                initLength: null,
                lesssonIndex: null,
            };
        },

        computed: {
            ...mapState('workflows', ['workflow', 'appSelected']),
            sortedApps() {
                return APP_LISTING.sort((a, b) => a.isCommingSoon - b.isCommingSoon);
            },
        },

        methods: {
            _isEmpty,
            ...mapActions('workflows', ['updateWorkflow', 'selectedApp']),
            async open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            dataHandled(data) {
                const lastStep = data[data.length - 1] || {};
                return [
                    ...data,
                    {
                        id: lastStep.id + 1,
                        parentId: lastStep.id,
                    },
                ];
            },
            async addAction(appSelected, action) {
                const lastStep = this.workflow[this.workflow.length - 1] || {};
                this.updateWorkflow([...this.workflow, {
                    id: lastStep.id + 1 || 100,
                    parentId: this.workflow.length ? lastStep.id : null,
                    name: action.label,
                    logo: appSelected.logo,
                }]);
                this.visible = false;
            },
        },
    };
</script>

<style>
</style>
