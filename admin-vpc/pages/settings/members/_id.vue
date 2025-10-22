<template>
    <div class="setting-member">
        <div class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-collection">
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/settings/members')">
                    <svg
                        viewBox="0 0 20 20"
                        class="m-0 w-[20px] h-[20px]"
                        focusable="false"
                        aria-hidden="true"
                    ><path fill-rule="evenodd" d="M16.75 10a.75.75 0 0 1-.75.75h-9.69l2.72 2.72a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06l-2.72 2.72h9.69a.75.75 0 0 1 .75.75Z" /></svg>
                </a-button>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-3">
                            <h4 class="m-0 text-[20px] font-bold">
                                {{ member.fullname || `${member.firstName || ''} ${member.lastName || ''}`}}
                            </h4>
                        </div>
                        <a-button
                            type="primary"
                            :loading="loading"
                            class="!flex items-center gap-2 justify-center"
                            @click="sendInvite"
                        >
                            Cập nhật
                        </a-button>
                    </div>
                </div>
            </div>
            <div class="card mt-4">
                <h4 class="text-[14px] m-0 font-[600]">
                    Vai trò & Quyền
                </h4>
                <div class="mt-4 rounded-md">
                    <a-collapse :bordered="false">
                        <a-collapse-panel
                            v-for="(role, index) in PERMISSIONS"
                            :key="index"
                            :show-arrow="false"
                        >
                            <template #header>
                                <div class="custom-header flex items-center justify-between">
                                    <div>
                                        <div class="ant-checkbox-wrapper ant-checkbox-wrapper-checked">
                                            <span :class="[handleCheckParent(role)?'ant-checkbox-checked':'','ant-checkbox' ]">
                                                <input
                                                    type="checkbox"
                                                    class="ant-checkbox-input"
                                                    :checked="handleCheckParent(role)"
                                                    @click="(event)=>event.stopPropagation()"
                                                    @change="()=>handleCheckAll(role)"
                                                >
                                                <span class="ant-checkbox-inner" /></span>
                                            <span><span class="font-[500] text-[13px] text-[#303030]">{{ role.title }}</span></span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <p class="m-0 font-bold text-[#303030]">
                                            {{ quantityCheck(role) }}/{{ quantityChildren(role).length }}
                                        </p>
                                        <svg
                                            class="transition-all duration-300"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        ><path
                                            stroke="#303030"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-miterlimit="10"
                                            stroke-width="1.5"
                                            d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                                        /></svg>
                                    </div>
                                </div>
                            </template>
                            <div class="child-accordition">
                                <a-collapse :bordered="false">
                                    <a-collapse-panel
                                        v-for="(roleChildrent, index) in role.childrent"
                                        :key="`roleChildrent_${index}`"
                                        :show-arrow="false"
                                    >
                                        <template #header>
                                            <div class="custom-header flex items-center justify-between">
                                                <div>
                                                    <!-- <a-checkbox
                                                        :checked="form.permisstions.includes(roleChildrent?.value)||handleCheckParent(roleChildrent)"
                                                        @change="()=>{!roleChildrent.childrent? handleChangeSingle(roleChildrent,role)
                                                            : handleCheckAll(roleChildrent)}"
                                                    >
                                                        <span class="font-[500] text-[13px] text-[#303030] ">{{ roleChildrent.title }}</span>
                                                    </a-checkbox> -->
                                                    <div class="ant-checkbox-wrapper ant-checkbox-wrapper-checked">
                                                        <span :class="[form.permisstions.includes(roleChildrent?.value)||handleCheckParent(roleChildrent)?'ant-checkbox-checked':'','ant-checkbox' ]">
                                                            <input
                                                                type="checkbox"
                                                                class="ant-checkbox-input"
                                                                :checked="form.permisstions.includes(roleChildrent?.value)||handleCheckParent(roleChildrent)"
                                                                @click="(event)=>event.stopPropagation()"
                                                                @change="()=>{!roleChildrent.childrent? handleChangeSingle(roleChildrent,role)
                                                                    : handleCheckAll(roleChildrent)}"
                                                            >
                                                            <span class="ant-checkbox-inner" /></span>
                                                        <span><span class="font-[500] text-[13px] text-[#303030]">{{ roleChildrent.title }}</span></span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-3">
                                                    <svg
                                                        class="transition-all duration-300"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                    ><path
                                                        stroke="#303030"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-miterlimit="10"
                                                        stroke-width="1.5"
                                                        d="M19.92 8.95l-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                                                    /></svg>
                                                </div>
                                            </div>
                                        </template>
                                        <div class="pl-2">
                                            <a-checkbox
                                                v-for="(action, index) in roleChildrent.childrent"
                                                :key="`action_${index}`"
                                                :checked="form.permisstions.includes(action?.value)"
                                                @change="()=>handleChangeSingle(action,roleChildrent)"
                                            >
                                                <span class="font-[500] text-[13px] text-[#303030] ">{{ action.label }}</span>
                                            </a-checkbox>
                                        </div>
                                    </a-collapse-panel>
                                </a-collapse>
                            </div>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _ from 'lodash';
    import _cloneDeep from 'lodash/cloneDeep';
    import _uniqBy from 'lodash/uniqBy';
    import _compact from 'lodash/compact';
    import { PERMISSIONS } from '@/constants/settings/permissions';

    export default {
        components: {
        },

        async fetch() {
            this.fetchData();
        },

        data() {
            return {
                loading: false,
                rules: {},
                form: {
                    permisstions: [],
                },
                data: [],
                PERMISSIONS,
            };
        },
        computed: {
            ...mapState('settings/members', ['member']),
        },

        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Cài đặt',
                link: '/settings',
            }, {
                label: 'Vai trò & Thành viên',
                link: '/settings/members',
            }, {
                label: 'Chi tiết',
                link: '',
            }]);
        },
        methods: {
            _cloneDeep,
            async fetchData() {
                try {
                    this.loading = true;
                    await this.$store.dispatch('settings/members/fetchDetail', this.$route.params.id);
                    console.log(this.member);
                    this.form.permisstions = this.member.permisstions || [];
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async sendInvite() {
                try {
                    this.loading = true;
                    await this.$api.settingMembers.update(this.member._id, {
                        permisstions: _uniqBy(_compact(this.form.permisstions)),
                    });
                    this.$message.success('Thao tác thành công');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            handleCheckParent(node) {
                const all = node?.childrent?.every((child) => this.form.permisstions.includes(child.value));
                return all;
            },
            recursionCheckAll(node) {
                const result = [];
                result.push(node.value);
                if (node.childrent && node.childrent.length > 0) {
                    node.childrent.forEach((child) => {
                        const arrChild = this.recursionCheckAll(child);
                        result.push(...arrChild);
                    });
                }
                return result;
            },
            quantityCheck(node) {
                const number = this.quantityChildren(node).filter((child) => this.form.permisstions.includes(child));
                return number.length;
            },
            recursionQuantityChildren(childrentTotal, node) {
                if (!node) return;
                if (node.childrent && node.childrent.length > 0) {
                    node.childrent.forEach((child) => {
                        this.recursionQuantityChildren(childrentTotal, child);
                    });
                } else {
                    childrentTotal.push(node.value);
                }
            },
            quantityChildren(node) {
                const childrentTotal = [];
                this.recursionQuantityChildren(childrentTotal, node);
                return childrentTotal;
            },
            handleCheckAll(node) {
                const newCheckedKeys = this.handleCheckParent(node)
                    ? _.difference(this.form.permisstions, this.recursionCheckAll(node))
                    : [...this.form.permisstions, ...this.recursionCheckAll(node)];
                this.form.permisstions = newCheckedKeys;
            },
            handleChangeSingle(node, parent) {
                const firstPart = node.value.match(/^(\w+)/)?.[1];
                const checkRegexUpdate = /update/.test(node.value);
                const checkRegexView = /view/.test(node.value);
                if (checkRegexView && this.form.permisstions.includes(`${firstPart}.update`)) return;
                const isChecked = this.form.permisstions.includes(node.value);
                const checkView = this.form.permisstions.includes(`${firstPart}.view`);
                let newCheckedKeys = isChecked
                    ? this.form.permisstions.filter((item) => item !== node.value)
                    : [...this.form.permisstions, node.value, ...(checkRegexUpdate && !checkView ? [`${firstPart}.view`] : [])];
                const isCheckedNew = parent?.childrent?.every((child) => newCheckedKeys.includes(child.value));
                if (!isChecked && isCheckedNew) {
                    newCheckedKeys.push(parent.value);
                } else if (isChecked && !isCheckedNew) {
                    newCheckedKeys = newCheckedKeys.filter((item) => item !== parent.value);
                }
                this.form.permisstions = newCheckedKeys.filter(Boolean);
            },
        },
        head() {
            return {
                title: 'Thêm thành viên',
            };
        },
    };
</script>
<style lang="scss">
.child-accordition {
    .ant-collapse-header, .ant-collapse-item {
        border: none;
    }
}
.setting-member{
    .ant-collapse > .ant-collapse-item.ant-collapse-no-arrow > .ant-collapse-header{
        padding: 12px 16px !important;
    }
}
</style>
