<template>
    <div class="flex flex-wrap items-center gap-4 justify-between">
        <div class="flex justify-center flex-col gap-2">
            <div class="text-gray-100 text-xl sm:text-3xl font-semibold flex items-center gap-2 cursor-pointer">
                <i v-if="showBack" class="fas fa-arrow-left text-2xl" @click="back" />
                {{ text }}
            </div>
            <div v-if="smallText" class="text-sm">
                {{ smallText }}
            </div>
        </div>
        <div>
            <slot name="right" />
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            text: String,
            smallText: String,
            showBack: {
                type: Boolean,
                default: false,
            },
            backUrl: String,
        },

        methods: {
            back() {
                if (this.backUrl) {
                    this.$router.push(this.backUrl);
                } else {
                    this.$router.go(-1);
                }
            },
        },
    };
</script>
