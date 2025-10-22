<template>
    <div>
        <div v-if="type === 'firstname'">
            <span class="text-[13px]">{{ `${value.firstname || ''} ${value.lastname || ''}` }}</span>
        </div>
        <div v-else-if="type === 'email'">
            <span class="block w-full truncate pr-2">{{ value.email }}</span>
        </div>
        <div v-else-if="type === 'phone'">
            {{ value.phone || '--' }}
        </div>
        <div v-else-if="type === 'address'">
            {{ value.address || '--' }}
        </div>
        <div v-else-if="type === 'source'">
            {{ value.source || '--' }}
        </div>
        <div v-else-if="type === 'fax'">
            {{ value.fax || '--' }}
        </div>
        <div v-else-if="type === 'birthday'">
            {{ moment(value.birthday).format('DD/MM/YYYY') || '--' }}
        </div>
        <div v-else-if="type === 'lastActive'">
            {{ moment(value.lastActive).format('HH:ss DD/MM/YYYY') || '--' }}
        </div>
        <div v-else-if="type === 'descriptions'">
            {{ value.descriptions || '--' }}
        </div>
        <div v-else-if="type === 'createdBy'">
            {{ value.createdBy?.fullname || '--' }}
        </div>
        <div v-else-if="type === 'type'">
            {{ value.type ? (value.type === 'personal' ? 'Personal' : 'Enterprise') : '--' }}
        </div>
        <div v-else-if="type === 'website'">
            <a v-if="value.website" :href="value.website">{{value.website}}</a>
            <span v-else>--</span>
        </div>
        <div v-else-if="type === 'status'">
            <span :class="`w-[160px] text-left inline-flex items-center justify-start gap-1.5 py-1 rounded-full text-[13px] font-[600] !text-[${STATUS_COLOR[value.status]}]`">
                <span :class="`w-2 h-2 rounded-full bg-[${STATUS_COLOR[value.status]}]`" :style="`background-color: ${STATUS_COLOR[value.status]}`" />
                <span :style="`color: ${STATUS_COLOR[value.status]}`">{{ $t(STATUS_LABEL[value.status]) }}</span>
            </span>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapDataFromOptions } from '@/utils/data';
    import { CUSTOMER_STATUS_OPTIONS } from '@/constants/customers/status';

    export default {
        props: {
            type: String,
            value: Object,
        },
        data() {
            return {
                isImageAvailable: true,
            };
        },
        computed: {
            STATUS_LABEL() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'label');
            },
            STATUS_COLOR() {
                return this.mapDataFromOptions(CUSTOMER_STATUS_OPTIONS, 'value', 'color');
            },
        },
        methods: {
            moment,
            mapDataFromOptions,
            imageError() {
                this.isImageAvailable = false;
            },
        },
    };
</script>
