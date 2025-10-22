<template>
    <div>
        <div class="grid grid-cols-4 p-4">
            <a-button
                v-for="(step, index) in steps"
                :key="`step_${index}`"
                class="!flex items-center gap-3 !border-0 !shadow-none"
                @click="stepSelected = index"
            >
                <a-button shape="circle">
                    {{ index + 1 }}
                </a-button>
                <p class="m-0 font-[600] min-w-fit">
                    {{ step.title }}
                </p>
                <div v-if="index < steps.length - 1" class="w-full rounded-sm h-1 bg-[#1351d8]" />
            </a-button>
        </div>
        <div v-if="stepSelected === 0" class="grid grid-cols-2 gap-4 p-4">
            <div class="m-0">
                <div class="">
                    <h4 class="m-0 text-[14px] font-bold">
                        {{ `Products` }}
                    </h4>
                </div>
                <div class="rounded-sm border flex items-center justify-between border-[#dcdde2] px-3 mt-2">
                    <p class="m-0 py-3 px-2">
                        Products selected: <span class="text-grey">1/1</span>
                    </p>
                    <div class="py-2">
                        <a-button type="outline" class="!rounded-[5px] !w-fit !border-[#1351d8] !text-[#1351d8]">
                            Edit products
                        </a-button>
                    </div>
                </div>
                <div class="rounded-md mt-2">
                    <h4 class="m-0 text-[14px] font-bold mb-2">
                        {{ `Content` }}
                    </h4>
                    <a-textarea
                        v-model="form.content"
                        placeholder="Content for ads"
                        :auto-size="{ minRows: 4, maxRows: 5 }"
                    />
                </div>
            </div>
            <div class="preivew" />
            <a-button type="primary" class="!w-fit" @click="submit">
                Create Ads
            </a-button>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        props: {
            loading: {
                type: Boolean,
                default: () => false,
            },
        },
        data() {
            return {
                steps: [
                    {
                        title: 'Content',
                    },
                    {
                        title: 'Audience',
                    },
                    {
                        title: 'Buget',
                    },
                    {
                        title: 'Review & Submit',
                    },
                ],
                stepSelected: 0,
                form: {
                    content: '',
                },
            };
        },
        computed: {
            ...mapState('facebook', ['page', 'ads', 'campainSelected']),
        },
        mounted() {
        },
        methods: {
            async submit() {
                this.$axios.post('/api/third-party/facebook/ads', {

                });
                // await this.$store.dispatch('facebook/createAds', {

                // });
            },
        },
    };
</script>
