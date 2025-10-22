<template>
    <div class="min-h-[350px] flex items-center justify-center gap-2 flex-col !py-[50px]">
        <img class="w-[70px] mb-4" src="/images/svgs/contract.svg" alt="/">
        <h3 class="font-semibold text-xl m-0 text-center">
            {{ `You don't have any invoice with ${`${customer.firstname || ''} ${customer.lastname || ''}` }` }}
        </h3>
        <p class="w-[100%] md:w-[50%] text-center">
            {{ 'Managing invoices between your business and customers is easier' }}
        </p>
        <div class="flex items-center gap-4 mt-4">
            <a-button
                type="primary"
                class="!bg-prim-100 !border-prim-100"
                @click="$router.push('/customers/segments/create')"
            >
                {{ 'Create invoice' }}
            </a-button>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        props: {
        },
        computed: {
            ...mapState('customers', ['customer', 'transactions']),
        },
    };
</script>
