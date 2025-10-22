<template>
    <div class="flex justify-between bg-white  ">
        <div class="flex-grow flex flex-col w-full  ">
            <TheHeader v-if="!checkPath" />
            <div class="flex-grow custom-scroll" :class="`${!checkPath ? 'mt-[73px]' : 'mt-10'}`">
                <nuxt class="bg-white" />
            </div>
            <TheFooter v-if="!checkPath" />
        </div>

        <ToastProduct :status="toast.status" :course="toast.course" :type="toast.type" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import TheHeader from '@/components/layout/TheHeader.vue';
    import TheFooter from '@/components/layout/TheFooter.vue';
    import ToastProduct from '@/components/cart/Toast.vue';

    export default {
        components: {
            TheHeader,
            TheFooter,
            ToastProduct,
        },

        data() {
            return {
            };
        },

        computed: {
            ...mapState('courses', ['toast']),
            checkPath() {
                return this.$route.name === 'khoa-hoc-cua-toi-id-trac-nghiem';
            },
        },
    };
</script>
