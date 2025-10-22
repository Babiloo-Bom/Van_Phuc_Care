<template>
    <div :class="`rounded-md flex gap-4 items-center ${theme ? 'hover:bg-[#d3d3d3]' : 'hover:bg-[#ffffff1a]'} transition duration-150 ease-out hover:ease-in p-2`">
        <div
            :class="`w-10 h-10 border-2 border-[#0c4ea4] rounded-full ${theme ? 'bg-[#d3d3d3]' : '!bg-[#3a3b3c] text-white'}`"
            aria-label="Accont"
        >
            <img class="rounded-full" src="https://public.nftstatic.com/static/nft/zipped/18c9df61b22847a09995efa3bd1d2ab2_zipped.jpeg" alt="avatar">
        </div>
        <p :class="`flex ${theme ? 'text-black' : 'text-[#e4e6eb]' } mb-0`">Sia</p>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        components: {
        },

        props: {
        },

        data() {
            return {
            };
        },

        computed: {
            ...mapState('setting/theme', ['theme']),
        },

        watch: {
        },

        methods: {
        },
    };
</script>

<style lang="scss">
</style>
