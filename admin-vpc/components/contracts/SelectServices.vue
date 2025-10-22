<template>
    <div class="flex items-end justify-between">
        <div class="w-full pr-4">
            <h4 class="text-[14px] font-[600]">
                {{ 'Dịch vụ' }}
            </h4>
            <a-select
                v-model="servicesSelected"
                show-search
                mode="multiple"
                :placeholder="`Chọn sản phẩm`"
                style="width: 100%;"
                :filter-option="true"
            >
                <div slot="dropdownRender" slot-scope="menu">
                    <v-nodes :vnodes="menu" />
                    <a-divider style="margin: 4px 0;" />
                    <div
                        style="padding: 4px 8px; cursor: pointer;"
                        @mousedown="e => e.preventDefault()"
                    >
                        <a-button type="" class="mb-1 !flex items-center !w-full gap-2 justify-center" @click="$router.push('/services/create')">
                            <svg
                                viewBox="0 0 24 24"
                                width="16"
                                height="16"
                                stroke="currentColor"
                                stroke-width="2"
                                fill="none"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="m-0"
                            ><line
                                x1="12"
                                y1="5"
                                x2="12"
                                y2="19"
                            /><line
                                x1="5"
                                y1="12"
                                x2="19"
                                y2="12"
                            /></svg>
                            {{ 'Tạo sản phẩm' }}
                        </a-button>
                    </div>
                </div>
                <a-select-option v-for="service in services" :key="service._id" :value="JSON.stringify(service)">
                    <div class="flex items-center gap-2">
                        <img
                            class="w-[60px] h-[60px] rounded-md p-[1px] object-cover"
                            style="border: 1px solid #ced4da;"
                            :src="service.thumbnail"
                            alt="/"
                        >
                        <div>
                            <h6 class="m-0">
                                {{ service.title }}
                            </h6>
                        </div>
                    </div>
                </a-select-option>
            </a-select>
        </div>
        <a-button
            :loading="loading"
            class="min-w-[135px]"
            type="primary"
            :disabled="!servicesSelected.length"
            @click="submit"
        >
            {{ 'Chọn' }}
        </a-button>
    </div>
</template>

<script>

    export default {
        components: {
            VNodes: {
                functional: true,
                render: (h, ctx) => ctx.props.vnodes,
            },
        },

        props: {
            data: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                loading: false,
                servicesSelected: [],
                serviceRender: [],
                services: this.data ? this.data : [],
            };
        },

        watch: {
            data(value) {
                this.services = value;
            },
        },

        methods: {
            submit() {
                this.$emit('submit', this.servicesSelected);
                this.servicesSelected = [];
            },
        },
    };
</script>
<style scoped>
.ant-select-selection__choice img {
    display: none;
}
</style>
