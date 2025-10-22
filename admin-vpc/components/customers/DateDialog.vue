<template>
    <a-modal
        v-model="visible"
        destroy-on-close
        :title="title"
        centered
        :mask-closable="false"
    >
        <a-date-picker
            v-model="dateInjected"
            format="DD/MM/YYYY"
            value-format="DD/MM/YYYY"
            placeholder="Chọn ngày tiêm"
        />
        <div slot="footer" class="flex justify-end items-center gap-2">
            <a-button class="w-28" @click="handleCancel">
                {{ 'Hủy' }}
            </a-button>
            <a-button
                :loading="loading"
                class="w-28"
                :type="confirmBtnType"
                :disabled="!dateInjected"
                @click="handleConfirm"
            >
                {{ 'Cập nhật' }}
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import moment from 'moment';
    import { mapActions, mapState } from 'vuex';

    export default {
        props: {
            title: {
                type: String,
                default: 'shared.save',
            },
            content: String,
            confirmBtn: {
                type: String,
                default: 'Đồng ý',
            },
            confirmIcon: String,
            confirmBtnType: {
                type: String,
                default: 'primary',
            },
            cancelBtn: {
                type: String,
                default: 'Hủy',
            },
        },

        data() {
            return {
                visible: false,
                loading: false,
                dateFormatList: 'DD/MM/YYYY',
                dateInjected: '',
                vaccinSelected: '',
            };
        },
        computed: {
            ...mapState('schedule-vaccins', ['schedules', 'scheduleSelected']),
        },

        methods: {
            ...mapActions('schedule-vaccins', ['selectedSchedule']),
            moment,
            open(data) {
                this.vaccinSelected = data;
                this.visible = true;
            },

            close() {
                this.visible = false;
                this.selectedSchedule(this.scheduleSelected?.filter((id) => id !== this.vaccinSelected));
            },

            async handleConfirm() {
                this.loading = true;
                await this.$emit('confirm', { id: this.vaccinSelected, dateInjected: this.dateInjected });
                this.dateInjected = '';
                this.vaccinSelected = '';
                this.loading = false;
                this.close();
            },

            handleCancel() {
                this.$emit('cancel');
                this.close();
            },
        },
    };
</script>
