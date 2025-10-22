<template>
    <div>
        <div v-if="!loading">
            <div class="chart-container" />
            <div class="absolute p-2 rounded-md right-2 bottom-0 flex items-end flex-col gap-2" style="">
                <a-button class="!w-10 !h-10 !p-0 !flex items-center justify-center !rounded-md !bg-[#fff]" @click="initChart">
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="M18.5 19.5h-4M16.5 21.5v-4M12.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 0 1-4.27-4.43A4.428 4.428 0 0 1 11.99 2c2.45 0 4.44 1.99 4.44 4.44 0 2.4-1.9 4.35-4.27 4.43ZM11.99 21.81c-1.82 0-3.63-.46-5.01-1.38-2.42-1.62-2.42-4.26 0-5.87 2.75-1.84 7.26-1.84 10.01 0"
                        stroke="#101323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                </a-button>
                <a-button class="!w-10 !h-10 !p-0 !flex items-center justify-center !rounded-md" @click="fitToScreen">
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM18 6 6 18"
                        stroke="#101323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /><path
                        d="M18 10V6h-4M6 14v4h4"
                        stroke="#101323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                </a-button>
                <a-button class="!w-10 !h-10 !p-0 !flex items-center justify-center !rounded-md" @click="zoomIn">
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="M9.2 11.7h5M11.7 14.2v-5M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"
                        stroke="#101323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                </a-button>
                <a-button class="!w-10 !h-10 !p-0 !flex items-center justify-center !rounded-md" @click="zoomOut">
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="M9 11.7h5M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2"
                        stroke="#101323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                </a-button>
                <a-button class="!w-10 !h-10 !p-0 !flex items-center justify-center !rounded-md" @click="compactChart(true)">
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="M17.4 19.25H6.6c-1.5 0-2.1-.64-2.1-2.23v-1.04c0-1.59.6-2.23 2.1-2.23h10.8c1.5 0 2.1.64 2.1 2.23v1.04c0 1.59-.6 2.23-2.1 2.23ZM15.4 10.75H8.6c-1.5 0-2.1-.64-2.1-2.23V7.48c0-1.59.6-2.23 2.1-2.23h6.8c1.5 0 2.1.64 2.1 2.23v1.04c0 1.59-.6 2.23-2.1 2.23ZM12 22v-2.4M12 13v-2M12 2v2.69"
                        stroke="#101323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                </a-button>
                <a-button class="!w-10 !h-10 !p-0 !flex items-center justify-center !rounded-md" @click="compactChart(false)">
                    <svg
                        class="transition-all duration-300"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                    ><path
                        d="M4.75 17.4V6.6c0-1.5.64-2.1 2.23-2.1h1.04c1.59 0 2.23.6 2.23 2.1v10.8c0 1.5-.64 2.1-2.23 2.1H6.98c-1.59 0-2.23-.6-2.23-2.1ZM13.25 15.4V8.6c0-1.5.64-2.1 2.23-2.1h1.04c1.59 0 2.23.6 2.23 2.1v6.8c0 1.5-.64 2.1-2.23 2.1h-1.04c-1.59 0-2.23-.6-2.23-2.1ZM2 12h2.4M11 12h2M22 12h-2.69"
                        stroke="#101323"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    /></svg>
                </a-button>
                <a-input placeholder="Tìm kiếm" @change="filterChart" />
            </div>
        </div>
        <div v-else class="flex items-center justify-center h-full min-h-[450px]">
            <span class="genstech-loader" />
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        data() {
            return {
                chart: null,
                loading: false,
                data: [
                    {
                        id: 100,
                        parentId: null,
                        name: 'Steven King',
                        lastName: 'King',
                        position: 'Chief Operating Officer',
                        image: 'https://bumbeishvili.github.io/avatars/avatars/portrait12.png',
                        email: 'SKING',
                        phone_number: '515.123.4567',
                        hire_date: '2003-07-16T19:00:00.000Z',
                        job_id: 'AD_PRES',
                        salary: 24000,
                        commission_pct: null,
                        department_id: 90,
                        job_min_salary: 20080,
                        location_state: 'Washington',
                        job_max_salary: 40000,
                        department_name: 'Executive',
                        department_location_id: 1700,
                        department_location_street_address: '2004 Charade Rd',
                        department_location_postal_code: 98199,
                        department_location_country_id: 'US',
                        department_location_country_name: 'United States of America',
                        department_location_country_region_id: 2,
                        department_location_country_region_name: 'Americas',
                    },
                    {
                        id: 101,
                        parentId: 100,
                        name: 'Neena Kochhar',
                        lastName: 'Kochhar',
                        position: 'Administration Vice President',
                        image: 'https://bumbeishvili.github.io/avatars/avatars/portrait85.png',
                        email: 'NKOCHHAR',
                        phone_number: '515.123.4568',
                        hire_date: '2005-10-20T20:00:00.000Z',
                        job_id: 'AD_VP',
                        salary: 17000,
                        commission_pct: null,
                        department_id: 90,
                        job_min_salary: 15000,
                        location_state: 'Washington',
                        job_max_salary: 30000,
                        department_name: 'Executive',
                        department_location_id: 1700,
                        department_location_street_address: '2004 Charade Rd',
                        department_location_postal_code: 98199,
                        department_location_country_id: 'US',
                        department_location_country_name: 'United States of America',
                        department_location_country_region_id: 2,
                        department_location_country_region_name: 'Americas',
                    },
                    {
                        id: 102,
                        parentId: 100,
                        name: 'Lex De Haan',
                        lastName: 'De Haan',
                        position: 'Administration Vice President',
                        image: 'https://bumbeishvili.github.io/avatars/avatars/portrait16.png',
                        email: 'LDEHAAN',
                        phone_number: '515.123.4569',
                        hire_date: '2001-02-12T20:00:00.000Z',
                        job_id: 'AD_VP',
                        salary: 17000,
                        commission_pct: null,
                        department_id: 90,
                        job_min_salary: 15000,
                        location_state: 'Washington',
                        job_max_salary: 30000,
                        department_name: 'Executive',
                        department_location_id: 1700,
                        department_location_street_address: '2004 Charade Rd',
                        department_location_postal_code: 98199,
                        department_location_country_id: 'US',
                        department_location_country_name: 'United States of America',
                        department_location_country_region_id: 2,
                        department_location_country_region_name: 'Americas',
                    },
                    {
                        id: 103,
                        parentId: 102,
                        name: 'Alexander Hunold',
                        lastName: 'Hunold',
                        position: 'Programmer',
                        image: 'https://bumbeishvili.github.io/avatars/avatars/portrait17.png',
                        email: 'AHUNOLD',
                        phone_number: '590.423.4567',
                        hire_date: '2006-02-02T20:00:00.000Z',
                        job_id: 'IT_PROG',
                        salary: 9000,
                        commission_pct: null,
                        department_id: 60,
                        job_min_salary: 4000,
                        location_state: 'Texas',
                        job_max_salary: 10000,
                        department_name: 'IT',
                        department_location_id: 1400,
                        department_location_street_address: '2014 Jabberwocky Rd',
                        department_location_postal_code: 26192,
                        department_location_country_id: 'US',
                        department_location_country_name: 'United States of America',
                        department_location_country_region_id: 2,
                        department_location_country_region_name: 'Americas',
                    },
                    {
                        id: 104,
                        parentId: 103,
                        name: 'Bruce Ernst',
                        lastName: 'Ernst',
                        position: 'Programmer',
                        image: 'https://bumbeishvili.github.io/avatars/avatars/portrait18.png',
                        email: 'BERNST',
                        phone_number: '590.423.4568',
                        hire_date: '2007-06-20T20:00:00.000Z',
                        job_id: 'IT_PROG',
                        salary: 6000,
                        commission_pct: null,
                        department_id: 60,
                        job_min_salary: 4000,
                        location_state: 'Texas',
                        job_max_salary: 10000,
                        department_name: 'IT',
                        department_location_id: 1400,
                        department_location_street_address: '2014 Jabberwocky Rd',
                        department_location_postal_code: 26192,
                        department_location_country_id: 'US',
                        department_location_country_name: 'United States of America',
                        department_location_country_region_id: 2,
                        department_location_country_region_name: 'Americas',
                    },
                ],
            };
        },
        computed: {
            ...mapState('settings/members', ['members', 'pagination']),
        },
        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Cài đặt',
                link: '/settings',
            }, {
                label: 'Cơ cấu tổ chức',
                link: '/settings/department',
            }]);
            // Load external scripts
            this.loading = true;
            this.loadScripts().then(async () => {
                // Scripts are loaded, now initialize the chart
                await this.$store.dispatch('settings/members/fetchAll');
                console.log(this.members);
                setTimeout(() => {
                    this.initChart(this.members.map((e, i) => ({ ...e, id: e._id, parentId: i !== 0 ? '658b03e819e21efb6987b6f9' : null })));
                }, 800);
                this.loading = false;
            });
        },
        methods: {
            fitToScreen() {
                if (this.chart) {
                    this.chart.fit();
                }
            },
            compactChart(value) {
                if (this.chart) {
                    this.chart.compact(value).render().fit();
                }
            },
            zoomIn() {
                if (this.chart) {
                    console.log('zoomIn');
                    this.chart.zoomIn();
                }
            },
            zoomOut() {
                if (this.chart) {
                    this.chart.zoomOut();
                }
            },
            filterChart(e) {
                // Get input value
                const value = e.target.value;

                // Clear previous highlighting
                this.chart.clearHighlighting();

                // Get chart nodes
                const data = this.chart.data();

                // Mark all previously expanded nodes for collapse
                // eslint-disable-next-line no-return-assign
                data.forEach((d) => (d._expanded = false));

                // Loop over data and check if input value matches any name
                data.forEach((d) => {
                    if (value !== '' && d.name.toLowerCase().includes(value.toLowerCase())) {
                        // If matches, mark node as highlighted
                        d._highlighted = true;
                        d._expanded = true;
                    }
                });

                // Update data and rerender graph
                this.chart.data(data).render().fit();
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
                    .nodeContent((d) => {
                        const color = '#FFFFFF';
                        const imageDiffVert = 27;
                        return `
                    <div data-id='${d.data.id}' style='width:${d.width}px;height:${d.height}px'>
                        <div class="orgchart-node" id='${d.data.id}' style="font-family: 'Be Vietnam Pro', sans-serif;background-color:${color};  margin-left:-1px;width:${d.width - 2}px;height:${d.height - imageDiffVert}px;border-radius:10px;border: 1px solid #E4E2E9">
                            <div style="padding:12px; display:flex; align-items: center;height:100%; gap: 8px">
                                <div><img src=" ${d.data.avatar}" style="object-fit:cover; border-radius:100px;min-width:40px;width:40px;height:40px;" /></div>
                                <div>
                                    <div style="font-size:15px; color:#08011E; width:fit-content">  ${`${d.data.firstName} ${d.data.lastName}`} </div>
                                    <div style="color:#716E7B;margin-top:3px;font-size:10px;"> ${d.data.position} </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                    })
                    .container('.chart-container')
                    .data(data)
                    .render();
                // Attach click event listeners to all nodes
                this.$nextTick(() => {
                    const nodes = this.$el.querySelectorAll('.orgchart-node');
                    nodes.forEach((node) => {
                        node.addEventListener('click', this.handleNodeClick);
                    });
                });
            },

            handleNodeClick({ target }) {
                console.log(target.id);
                this.someMethod(target.id);
            },
            someMethod() {
            // Add your logic here
            },
        },
    };
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
}
</style>
