<template>
    <div>
        <a-tooltip placement="topLeft" :title="$t('shared.customize_columns')" arrow-point-at-center>
            <a-button
                type="link"
                class="group hover:!bg-[#53c66e] !rounded-full !w-[35px] !h-[35px] !p-0 transition hover:ease-in !flex items-center gap-2 justify-center"
                @click="openCustomizeColumns"
            >
                <svg
                    class="transition-all duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                ><path
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    stroke="#161a21"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /><path
                    d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.899 1.899 0 0 1-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9Z"
                    stroke="#161a21"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /></svg>
            </a-button>
        </a-tooltip>
        <a-drawer
            class="customize_columns"
            :visible="visible"
            :width="500"
            placement="right"
            @close="visible = false"
        >
            <div class="min-h-[65px] py-3 px-4 mb-4">
                <div>
                    <h6 class="m-0 font-bold text-[18px]">
                        {{ $t('shared.customize_columns') }}
                    </h6>
                    <p class="m-0">
                        Select which columns to show, or drag them into<br> a different order.
                    </p>
                </div>
            </div>
            <div class="px-4">
                <Container
                    :data-index="0"
                    group-name="column"
                    @drop="onDrop(0, $event)"
                >
                    <Draggable v-for="(item, idx) in columns" :key="`section_${idx}`">
                        <div class="relative group h-12 mb-2">
                            <a-button
                                class="!h-12 !w-full mb-2 !text-left !flex items-center justify-between !py-3 !pl-1 !pr-1"
                                type=""
                                @click="toggleShowDetailSetting(item)"
                            >
                                <div class="flex items-center gap-1">
                                    <svg class="w-[15px]" style="fill: #919191" viewBox="0 0 20 20"><path d="M6.75 3.5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Z" /><path d="M6.75 8.5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Z" /><path d="M5.75 14.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1Z" /><path d="M12.25 3.5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Z" /><path d="M11.25 9.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1Z" /><path d="M12.25 13.5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Z" /></svg>
                                    <span>{{ $t(item.label) }}</span>
                                </div>
                            </a-button>
                            <div class="absolute right-2 top-0 z-20 group-hover:opacity-100 opacity-0  transition duration-100 ease-out hover:ease-in">
                                <a-button type="text" class="!p-1 !w-[30px] flex items-center justify-center !h-[31px] !border-0 back !bg-[transparent]" @click="deleteComponet(data)">
                                    <svg
                                        viewBox="0 0 20 20"
                                        class="!m-0 w-[23px] h-[23px]"
                                        focusable="false"
                                        aria-hidden="true"
                                    ><path fill="#000" d="M11.5 8.25a.75.75 0 0 1 .75.75v4.25a.75.75 0 0 1-1.5 0v-4.25a.75.75 0 0 1 .75-.75Z" /><path fill="#000" d="M9.25 9a.75.75 0 0 0-1.5 0v4.25a.75.75 0 0 0 1.5 0v-4.25Z" /><path fill="#000" fill-rule="evenodd" d="M7.25 5.25a2.75 2.75 0 0 1 5.5 0h3a.75.75 0 0 1 0 1.5h-.75v5.45c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311c-.642.327-1.482.327-3.162.327h-.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311c-.327-.642-.327-1.482-.327-3.162v-5.45h-.75a.75.75 0 0 1 0-1.5h3Zm1.5 0a1.25 1.25 0 1 1 2.5 0h-2.5Zm-2.25 1.5h7v5.45c0 .865-.001 1.423-.036 1.848-.033.408-.09.559-.128.633a1.5 1.5 0 0 1-.655.655c-.074.038-.225.095-.633.128-.425.035-.983.036-1.848.036h-.4c-.865 0-1.423-.001-1.848-.036-.408-.033-.559-.09-.633-.128a1.5 1.5 0 0 1-.656-.655c-.037-.074-.094-.225-.127-.633-.035-.425-.036-.983-.036-1.848v-5.45Z" /></svg>
                                </a-button>
                                <a-button type="text" class="!p-1 !w-[30px] flex items-center justify-center !h-[31px] !border-0 back !bg-[transparent]" @click="handleStyle({ display: 'none'})">
                                    <svg
                                        viewBox="0 0 20 20"
                                        class="!m-0 w-[23px] h-[23px]"
                                        focusable="false"
                                        aria-hidden="true"
                                    ><path fill="#000" fill-rule="evenodd" d="M13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-1.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" /><path fill="#000" fill-rule="evenodd" d="M10 4c-2.476 0-4.348 1.23-5.577 2.532a9.266 9.266 0 0 0-1.4 1.922 5.98 5.98 0 0 0-.37.818c-.082.227-.153.488-.153.728s.071.501.152.728c.088.246.213.524.371.818.317.587.784 1.27 1.4 1.922 1.229 1.302 3.1 2.532 5.577 2.532 2.476 0 4.348-1.23 5.577-2.532a9.265 9.265 0 0 0 1.4-1.922 5.98 5.98 0 0 0 .37-.818c.082-.227.153-.488.153-.728s-.071-.501-.152-.728a5.984 5.984 0 0 0-.371-.818 9.269 9.269 0 0 0-1.4-1.922c-1.229-1.302-3.1-2.532-5.577-2.532Zm-5.999 6.002v-.004c.004-.02.017-.09.064-.223a4.5 4.5 0 0 1 .278-.608 7.768 7.768 0 0 1 1.17-1.605c1.042-1.104 2.545-2.062 4.487-2.062 1.942 0 3.445.958 4.486 2.062a7.77 7.77 0 0 1 1.17 1.605c.13.24.221.447.279.608.047.132.06.203.064.223v.004c-.004.02-.017.09-.064.223a4.503 4.503 0 0 1-.278.608 7.768 7.768 0 0 1-1.17 1.605c-1.042 1.104-2.545 2.062-4.487 2.062-1.942 0-3.445-.958-4.486-2.062a7.766 7.766 0 0 1-1.17-1.605 4.5 4.5 0 0 1-.279-.608c-.047-.132-.06-.203-.064-.223Z" /></svg>
                                </a-button>
                            </div>
                        </div>
                    </Draggable>
                </Container>
            </div>
        </a-drawer>
    </div>
</template>

<script>
    import { Container, Draggable } from 'vue-dndrop';
    import Vue from 'vue';

    function applyDrag(arr, dragResult) {
        const { removedIndex, addedIndex, payload } = dragResult;
        if (removedIndex === null && addedIndex === null) return arr;

        const result = [...arr];
        let itemToAdd = payload;

        if (removedIndex !== null) {
            itemToAdd = result.splice(removedIndex, 1)[0];
        }

        if (addedIndex !== null) {
            result.splice(addedIndex, 0, itemToAdd);
        }

        return result;
    }

    export default {
        name: 'Events',

        components: {
            Container,
            Draggable,
        },
        props: {
            columns: {
                type: Array,
                default: () => [],
            },
        },
        data() {
            return {
                groups: [],
                visible: false,
            };
        },
        created() {
            this.groups.push(this.columns);
        },

        methods: {
            openCustomizeColumns() {
                this.visible = true;
            },
            applyDrag(arr, dragResult) {
                const { removedIndex, addedIndex, payload } = dragResult;
                if (removedIndex === null && addedIndex === null) return arr;

                const result = [...arr];
                let itemToAdd = payload;

                if (removedIndex !== null) {
                    itemToAdd = result.splice(removedIndex, 1)[0];
                }

                if (addedIndex !== null) {
                    result.splice(addedIndex, 0, itemToAdd);
                }
                return result;
            },

            onDrop(groupIndex, dropResult) {
                const result = applyDrag(this.groups[groupIndex], dropResult);
                Vue.set(this.groups, groupIndex, result);
            },

            handleStyle() {
                console.log('ok');
            },

        },
    };
</script>
<style lang="scss">
.customize_columns {
    .ant-drawer-body {
        padding: 4px;
    }
    .ant-drawer-content-wrapper {
    max-width: 100%;
    }
}
</style>
