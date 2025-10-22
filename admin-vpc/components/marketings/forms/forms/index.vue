<template>
    <div class="bg-white p-4">
        <a-form-model
            ref="form"
            :model="form"
            :rules="rules"
        >
            <div class="max-w-[400px]">
                <a-collapse>
                    <template #expandIcon="props">
                        <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
                    </template>
                    <a-collapse-panel key="1" header="Thông tin cơ bản">
                        <a-form-model-item label="Tiêu đề" prop="title">
                            <a-input v-model="form.title" />
                        </a-form-model-item>
                        <a-form-model-item label="Mô tả thông tin" prop="">
                            <a-textarea v-model="form.description" :auto-size="{ minRows: 3, maxRows: 3 }" />
                        </a-form-model-item>
                    </a-collapse-panel>
                </a-collapse>
            </div>
            <div class="mt-4 border-solid border-b-[1px] border-b-gray-40 pt-4">
                <div class="grid grid-cols-4 overflow-hidden">
                    <div
                        v-for="tab, index in tabs"
                        :key="tab.value"
                        class="group text-center py-4  rounded-t-sm cursor-pointer hover:bg-prim-100 hover:text-white transition-all duration-300"
                        :class="[activeTab === tab.value && 'bg-prim-100 text-white']"
                        @click="activeTab = tab.value"
                    >
                        <span class="text-4xl">{{ index + 1 }}</span>
                        <h3
                            class="text-lg font-semibold group-hover:text-white transition-all duration-300"
                            :class="[activeTab === tab.value && 'text-white']"
                        >
                            {{ tab.label }}
                        </h3>
                    </div>
                </div>
            </div>

            <div class="p-4 mt-2">
                <ExploitForm v-show="activeTab === 'exploit'" />
                <SettingsForm v-show="activeTab === 'settings'" />
                <AdvanceForm v-show="activeTab === 'advance'" />
            </div>
        </a-form-model>
    </div>
</template>

<script>
    import ExploitForm from '@/components/marketings/forms/forms/Exploit.vue';
    import SettingsForm from '@/components/marketings/forms/forms/Settings.vue';
    import AdvanceForm from '@/components/marketings/forms/forms/Advance.vue';

    export default {
        components: {
            ExploitForm,
            SettingsForm,
            AdvanceForm,
        },

        data() {
            return {
                form: {
                    pass: '',
                    checkPass: '',
                    age: '',
                },
                rules: {},
                activeTab: 'exploit',
                tabs: [{
                    label: 'Thông tin cần khai thác',
                    value: 'exploit',
                }, {
                    label: 'Thiết lập',
                    value: 'settings',
                }, {
                    label: 'Mã nhúng',
                    value: 'script',
                }, {
                    label: 'Nâng cao',
                    value: 'advance',
                }],
            };
        },
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                    } else {
                        return false;
                    }
                });
            },
            resetForm() {
                this.$refs.form.resetFields();
            },
        },
    };
</script>
