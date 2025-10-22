<template>
    <div class="card flex items-center justify-center gap-2 flex-col !pb-[50px]">
        <!-- <img src="/images/empty-customer.svg" alt="/"> -->
        <svg
            width="226"
            height="226"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        ><path d="M187 116c0 40.87-33.13 74-74 74s-74-33.13-74-74 33.13-74 74-74 74 33.13 74 74z" fill="#F0F1F2" /><mask
            id="b"
            maskUnits="userSpaceOnUse"
            x="39"
            y="36"
            width="148"
            height="154"
        ><path d="M187 116c0 40.87-33.13 74-74 74s-74-33.13-74-74V36h148v80z" fill="#fff" /></mask><g filter="url(#a)" mask="url(#b)"><path d="M58.77 190h107.47c2.083 0 3.77-2.098 3.761-4.688V47a4 4 0 0 0-4-4H59a4 4 0 0 0-4 4v138.312c0 2.59 1.687 4.688 3.77 4.688z" fill="#fff" /></g><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M148.223 137.277a.944.944 0 0 0-.667-.277h-6.612a.944.944 0 0 0-.944.944v6.612c0 .25.1.49.277.667l8.5 8.5a.943.943 0 0 0 1.335 0l6.611-6.611a.943.943 0 0 0 0-1.335l-8.5-8.5zm-4.917 4.445a1.416 1.416 0 1 1-.001-2.833 1.416 1.416 0 0 1 .001 2.833z"
            fill="#D2D5D9"
        /><path d="M98 143.5c0-1.381 1.02-2.5 2.28-2.5h16.44c1.259 0 2.28 1.119 2.28 2.5s-1.021 2.5-2.28 2.5h-16.44c-1.26 0-2.28-1.119-2.28-2.5zm0 9c0-1.381 1.04-2.5 2.323-2.5h25.354c1.283 0 2.323 1.119 2.323 2.5s-1.04 2.5-2.323 2.5h-25.354C99.04 155 98 153.881 98 152.5zm-16.096-10.812c0 2.589-1.972 4.688-4.404 4.688s-4.404-2.099-4.404-4.688c0-2.589 1.972-4.688 4.404-4.688s4.404 2.099 4.404 4.688zm-12.205 10.278c1.446-1.211 4.323-3.17 7.801-3.17 3.478 0 6.355 1.959 7.801 3.17.645.54.847 1.453.592 2.284l-.348 1.134c-.296.964-1.14 1.616-2.093 1.616H71.548c-.953 0-1.798-.652-2.093-1.616l-.348-1.134c-.255-.831-.054-1.744.592-2.284z" fill="#D2D5D9" /><rect
            x="63"
            y="51"
            width="101"
            height="40"
            rx="4"
            fill="#F0F1F2"
        /><path d="M81.904 65.688c0 2.59-1.972 4.688-4.404 4.688s-4.404-2.099-4.404-4.688c0-2.59 1.972-4.688 4.404-4.688s4.404 2.099 4.404 4.688zM69.699 75.966c1.446-1.21 4.323-3.17 7.801-3.17 3.478 0 6.355 1.96 7.801 3.17.645.54.847 1.453.592 2.284l-.348 1.134c-.296.964-1.14 1.616-2.093 1.616H71.548c-.953 0-1.798-.652-2.093-1.616l-.348-1.134c-.255-.83-.054-1.744.592-2.285z" :fill="setting?.color?.main" /><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M148.223 64.277a.943.943 0 0 0-.667-.277h-6.612a.944.944 0 0 0-.944.944v6.612c0 .25.1.49.277.667l8.5 8.5a.944.944 0 0 0 1.335 0l6.611-6.61a.944.944 0 0 0 0-1.336l-8.5-8.5zm-4.917 4.445a1.417 1.417 0 1 1-.001-2.833 1.417 1.417 0 0 1 .001 2.833z"
            :fill="setting?.color?.main"
        /><path d="M98 66.5c0-1.38 1.02-2.5 2.28-2.5h16.44c1.259 0 2.28 1.12 2.28 2.5s-1.021 2.5-2.28 2.5h-16.44C99.02 69 98 67.88 98 66.5zm0 9c0-1.38 1.04-2.5 2.323-2.5h25.354c1.283 0 2.323 1.12 2.323 2.5s-1.04 2.5-2.323 2.5h-25.354C99.04 78 98 76.88 98 75.5z" fill="#B6BABF" /><path d="M82.904 104.688c0 2.589-1.972 4.688-4.404 4.688s-4.404-2.099-4.404-4.688c0-2.589 1.972-4.688 4.404-4.688s4.404 2.099 4.404 4.688zm-12.205 10.278c1.446-1.211 4.323-3.17 7.801-3.17 3.478 0 6.355 1.959 7.801 3.17.645.54.847 1.453.592 2.284l-.348 1.134c-.296.964-1.14 1.616-2.093 1.616H72.548c-.953 0-1.798-.652-2.093-1.616l-.348-1.134c-.255-.831-.054-1.744.592-2.284z" fill="#D2D5D9" /><path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M149.223 100.277a.944.944 0 0 0-.667-.277h-6.612a.944.944 0 0 0-.944.944v6.612c0 .25.1.49.277.667l8.5 8.5a.943.943 0 0 0 1.335 0l6.611-6.611a.943.943 0 0 0 0-1.335l-8.5-8.5zm-4.917 4.445a1.416 1.416 0 1 1-.001-2.833 1.416 1.416 0 0 1 .001 2.833z"
            fill="#D2D5D9"
        /><path d="M99 106.5c0-1.381 1.021-2.5 2.28-2.5h16.44c1.259 0 2.28 1.119 2.28 2.5s-1.021 2.5-2.28 2.5h-16.44c-1.259 0-2.28-1.119-2.28-2.5zm0 9c0-1.381 1.04-2.5 2.323-2.5h25.354c1.283 0 2.323 1.119 2.323 2.5s-1.04 2.5-2.323 2.5h-25.354c-1.283 0-2.323-1.119-2.323-2.5z" fill="#D2D5D9" /><defs><filter
            id="a"
            x="45"
            y="35"
            width="135"
            height="167"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
        ><feFlood flood-opacity="0" result="BackgroundImageFix" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" /><feOffset dy="2" /><feGaussianBlur stdDeviation="5" /><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" /><feBlend in2="BackgroundImageFix" result="effect1_dropShadow" /><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" /></filter></defs></svg><h3 class="font-semibold text-xl text-center">
            {{ 'Chưa có dữ liệu khách hàng' }}
        </h3>
        <div class="flex items-center gap-4">
            <a-button type="dashed" class="!flex items-center gap-2 justify-center" @click="$refs.import.open()">
                <svg
                    class="transition-all duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                ><path
                    d="M9 17v-6l-2 2M9 11l2 2"
                    stroke="#161a21"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /><path
                    d="M22 10v5c0 5-2 7-7 7H9c-5 0-7-2-7-7V9c0-5 2-7 7-7h5"
                    stroke="#161a21"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /><path
                    d="M22 10h-4c-3 0-4-1-4-4V2l8 8Z"
                    stroke="#161a21"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                /></svg>
                Import
            </a-button>
            <a-button type="primary" class="!flex items-center gap-2 justify-center" @click="$refs.create.open()">
                <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="m-0"
                ><line
                    x1="12"
                    y1="5"
                    x2="12"
                    y2="19"
                /><line
                    x1="5"
                    y1="12"
                    x2="19"
                    y2="12"
                /></svg>
                {{ 'Thêm khách hàng' }}
            </a-button>
        </div>
        <!-- <CustomerImportModal ref="import" /> -->
        <CustomerCreateModal ref="create" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    // import CustomerImportModal from '@/components/customers/ImportDialog.vue';
    import CustomerCreateModal from '@/components/customers/CreateModal.vue';

    export default {
        components: {
            // CustomerImportModal,
            CustomerCreateModal,
        },

        computed: {
            ...mapState('settings', ['setting']),
        },
    };
</script>
