<template>
    <div>
        <div class="card !px-6 !py-3">
            <div class="flex items-center justify-between">
                <a-button class="!flex items-center !gap-2 !w-auto !p-0 !border-0" type="text">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="transition-all duration-300"
                    ><path
                        stroke="#4a4a4a"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M8.9 7.56c.31-3.6 2.16-5.07 6.21-5.07h.13c4.47 0 6.26 1.79 6.26 6.26v6.52c0 4.47-1.79 6.26-6.26 6.26h-.13c-4.02 0-5.87-1.45-6.2-4.99M15 12H3.62M5.85 8.65L2.5 12l3.35 3.35"
                    /></svg>
                    <h5 class="!m-0">
                        Exit
                    </h5>
                </a-button>
                <div class="flex items-center gap-2">
                    <h6 class="!m-0 font-[600] text-[16px]">
                        Demo Synck workflow
                    </h6>
                    <div class="cursor-pointer transition-all duration-150 hover:bg-[#efefef] p-[6px] rounded-sm">
                        <svg
                            class="transition-all duration-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                        ><path
                            d="m13.26 3.6-8.21 8.69c-.31.33-.61.98-.67 1.43l-.37 3.24c-.13 1.17.71 1.97 1.87 1.77l3.22-.55c.45-.08 1.08-.41 1.39-.75l8.21-8.69c1.42-1.5 2.06-3.21-.15-5.3-2.2-2.07-3.87-1.34-5.29.16Z"
                            stroke="#4a4a4a"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        /><path
                            d="M11.89 5.05a6.126 6.126 0 0 0 5.45 5.15M3 22h18"
                            stroke="#4a4a4a"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        /></svg>
                    </div>
                </div>
                <a-button type="primary" class="!bg-[#1351d8]">
                    Turn on workflow
                </a-button>
            </div>
        </div>
        <div>
            <div v-if="!loading">
                <div class="chart-container" />
            </div>
            <div v-else class="flex items-center justify-center h-screen">
                <span class="genstech-loader" />
            </div>
        </div>
        <DrawSelectedApp ref="drawSelectedApp" />
        <DrawDetailAction ref="drawDetailAction" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import DrawSelectedApp from '@/components/workflow/DrawSelectedApp.vue';
    import DrawDetailAction from '@/components/workflow/DrawDetailAction.vue';

    export default {
        layout: 'workflow',
        components: {
            DrawSelectedApp,
            DrawDetailAction,
        },

        async fetch() {
            await this.fetchData();
        },
        data() {
            return {
                chart: null,
                loading: false,
                loadingTable: false,
                search: false,
                checking: false,
                visible: false,
            };
        },

        computed: {
            ...mapState('workflows', ['workflow', 'appSelected']),
        },

        watch: {
            '$route.query': {
            },

            workflow: {
                handler() {
                    this.chart.data(this.dataHandled(this.workflow)).expandAll().render();
                },
            },

        },

        mounted() {
            this.loading = true;
            this.loadScripts().then(async () => {
                setTimeout(() => {
                    this.initChart(this.workflow);
                }, 500);
                this.loading = false;
            });
        },

        methods: {
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('courses/fetchAll');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            loadScripts() {
                // Define script sources
                const scriptSources = [
                    'https://cdn.synck.io.vn/assets/d3.v7.min.js',
                    'https://cdn.synck.io.vn/assets/d3-org-chart.js',
                    'https://cdn.synck.io.vn/assets/d3-flextree.js',
                ];

                // Function to load a single script
                const loadScript = (src) => new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = src;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });

                // Load all scripts sequentially using reduce
                return scriptSources.reduce((chain, src) => chain.then(() => loadScript(src)), Promise.resolve());
            },
            initChart(data) {
                // Now initialize the chart after scripts are loaded
                const { d3 } = window; // d3 should be globally available after script loading
                this.chart = new d3.OrgChart()
                    .nodeHeight(() => 110)
                    .nodeWidth(() => 222)
                    .childrenMargin(() => 50)
                    .compactMarginBetween(() => 35)
                    .compactMarginPair(() => 30)
                    .neighbourMargin(() => 20)
                    .nodeContent((d) => `
                    <div data-id='${d.data.id}' style='width:${d.width}px;height:${d.height}px'>
                        <div class="orgchart-node" style="">
                            <div class="header-card-trigger"  >
                                <div>${!d.data.parentId ? 'Start when' : 'Do action...'}</div>
                                ${d.data.logo ? `<img src="${d.data.logo}" alt="${d.data.name}" />` : ''}
                            </div>
                            <div class="content-card-trigger" style="padding:12px; height:100%">
                            ${
                        d.data.name
                        || `<button>
                                    <svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 12h12M12 18V6" stroke="#1351d8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                    Add trigger
                                </button>`
                    }
                            <div class="icon-setting" id='${d.data.id}' >
                            <svg class="transition-all duration-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.57 18.5v-3.9M15.57 7.45V5.5M15.57 12.65a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2ZM8.43 18.5v-1.95M8.43 9.4V5.5M8.43 16.55a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z" stroke="#ffffff" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                            </div>
                            </div>
                        </div>
                    </div>`)
                    .onNodeClick((d) => {
                        this.handleNodeClick(d.id);
                    })
                    .container('.chart-container')
                    .data(this.dataHandled(data))
                    .render();
            },

            dataHandled(data) {
                const lastStep = data[data.length - 1] || {};
                return [
                    ...data,
                    {
                        id: lastStep.id + 1 || 100,
                        parentId: lastStep.id,
                    },
                ];
            },

            handleNodeClick(id) {
                const ghostAction = this.workflow.some((e) => e.id === Number(id));
                if (ghostAction) {
                    this.$refs.drawDetailAction.open();
                    return;
                }
                this.$refs.drawSelectedApp.open();
            },
        },

        head() {
            return {
                title: 'Workflow create',
            };
        },
    };
</script>
<style lang="scss">
.header-card-trigger {
    width: 100%;
    background: #f8f9fa;
    border-radius: 10px 10px 0 0;
    padding: 12px;
    font-family: 'Be Vietnam Pro', sans-serif;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
        width: 20px;
        height: 20px;
        border-radius: 4px;
    }
}
.orgchart-node {
    font-family: 'Be Vietnam Pro', sans-serif;
    background-color: #fff;
    margin-left:-1px;
    border-radius:10px;
    border: 1px solid #E4E2E9;
    button {
        display: flex;
        gap: 4px;
        align-items: center;
        color: #1351d8;
        font-weight: 600;
    }
}
.workflow-selection {
    .ant-drawer-wrapper-body {
        background: #ffffff !important;
    }
}
.content-card-trigger {
    position: relative;
    .icon-setting {
        cursor: pointer;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(50%, -50%);
        background: #1351d8;
        border-radius: 50%;
        padding: 4px
    }
}
</style>
