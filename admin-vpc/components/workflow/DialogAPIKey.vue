<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :centered="true"
        :title="`Connect ${data.name}`"
    >
        <template>
            <p class="!m-0">
                Enter your<span class="font-bold"> {{ data.name }} </span> API key below.
            </p>
            <p class="!m-0">
                See <a :href="data.linkGuide" target="_blank" class="!text-[#1351d8] font-bold">here</a> for instructions on how to retrieve your API key
            </p>
            <div class="mt-2">
                <a-input class="mt-2" placeholder="Enter your API Key"></a-input>
            </div>
        </template>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="close">
                Cancel
            </a-button>
            <a-button
                :loading="loading"
                class="w-28 !bg-[#1351d8] !border-[#1351d8]"
                type="primary"
                @click="handleConnect"
            >
                {{ 'Connect' }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: {
        },

        data() {
            return {
                visible: false,
                data: {},
                loading: false,
            };
        },

        methods: {
            open(data) {
                this.visible = true;
                this.data = data;
            },

            close() {
                this.visible = false;
            },

            handleConnect() {
                console.log('ol');
            },
        },
    };
</script>
