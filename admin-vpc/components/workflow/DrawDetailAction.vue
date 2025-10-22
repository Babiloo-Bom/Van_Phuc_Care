<template>
    <a-drawer
        class="workflow-selection"
        :visible="visible"
        :width="550"
        placement="right"
        @close="visible = false"
    >
        <div class="min-h-[65px] py-3 px-4">
            <div>
                <h6 v-if="appSelected" class="m-0 font-bold text-[16px]">
                    {{ appSelected.name }}
                </h6>
            </div>
        </div>
    </a-drawer>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import _isEmpty from 'lodash/isEmpty';

    export default {
        components: {
        },

        props: {
        },

        data() {
            return {
                visible: false,
                loading: false,
                lesson: null,
                action: null,
                initLength: null,
                lesssonIndex: null,
            };
        },

        computed: {
            ...mapState('workflows', ['workflow', 'appSelected']),
        },

        methods: {
            _isEmpty,
            ...mapActions('workflows', ['updateWorkflow', 'selectedApp']),
            async open() {
                this.visible = true;
            },

            close() {
                this.visible = false;
            },

            dataHandled(data) {
                const lastStep = data[data.length - 1] || {};
                return [
                    ...data,
                    {
                        id: lastStep.id + 1,
                        parentId: lastStep.id,
                    },
                ];
            },
            async addAction(appSelected, action) {
                const lastStep = this.workflow[this.workflow.length - 1] || {};
                this.updateWorkflow([...this.workflow, {
                    id: lastStep.id + 1 || 100,
                    parentId: this.workflow.length ? lastStep.id : null,
                    name: action.label,
                    logo: appSelected.logo,
                }]);
                this.visible = false;
            },
        },
    };
</script>

<style>
</style>
