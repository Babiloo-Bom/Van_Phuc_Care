<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :width="500"
        :title="$t(title)"
    >
        <div v-if="!loading" class="grid grid-cols-4 gap-x-4 gap-y-6 page-listed">
            <div
                v-for="(record, index) in data"
                :key="`card_page_${index}`"
                class="relative cursor-pointer rounded-md group flex items-center justify-center flex-col min-h-[calc(25%)]"
                @click="selected = record"
            >
                <img
                    style="border-style: solid"
                    :class="`w-full border-2 transition-all duration-150 ${selected.id === record.id ? '!border-[#1351d8]  opacity-100' : 'border-[transparent] opacity-40 '} rounded-md`"
                    :src="record.picture"
                    alt="/"
                >
                <p class="m-0 text-center mt-2 truncate font-[600] text-[#000]">
                    {{ record.name }}
                </p>
                <div v-if="selected.id === record.id" class="w-6 h-6 rounded-full absolute -top-[11px] bg-[#1351d8] -right-[9px] flex items-center justify-center">
                    <svg
                        viewBox="0 0 10 8"
                        fill="#fff"
                        width="10"
                        height="7.8"
                    ><path d="M3.5 5.2L1.2 3 0 4.2 3.5 7.8 10 1.2 8.8 0z" /></svg>
                </div>
            </div>
        </div>
        <div v-else class="flex items-center justify-center min-h-[350px]">
            <div class="race-by " />
        </div>
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="handleCancel">
                {{ $t('shared.cancel') }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28 !bg-[#1351d8] !border-[#1351d8]"
                :type="confirmBtnType"
                @click="handleConfirm"
            >
                {{ $t(confirmBtn) }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: 'shared.save',
            },
            content: String,
            confirmBtn: {
                type: String,
                default: 'other.apply',
            },
            confirmIcon: String,
            loading: {
                type: Boolean,
            },
            status: {
                type: Boolean,
            },
            confirmBtnType: {
                type: String,
                default: 'primary',
            },
            cancelBtn: {
                type: String,
                default: 'Hủy',
            },
            data: {
                type: Array,
                default: () => [],
            },
        },

        data() {
            return {
                visible: false,
                selected: {},
            };
        },
        watch: {
            data: {
                handler(value) {
                    this.selected = value.find((e) => !e.website);
                },
                deep: true,
            },
        },

        methods: {
            open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            async handleConfirm() {
                await this.$emit('confirm', this.selected);
                this.close();
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },
        },
    };
</script>
<style lang="scss">
.page-listed {
    img:hover {
        border: 2px solid #1351d8;
        opacity: 1;
    }
}
</style>
