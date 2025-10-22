<template>
    <div>
        <div class="max-w-[1200px] !mx-auto w-full block p-4 pt-0 detail-collection">
            <div class="flex items-center justify-start gap-3">
                <a-button type="text" class="!p-0 !w-[25px] !h-[25px] !border-0 back !bg-[transparent]" @click="$router.push('/settings')">
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
                                {{ 'Thông tin liên hệ' }}
                            </h4>
                        </div>
                        <a-button
                            type="primary"
                            :loading="loadingUpdate"
                            class="!flex items-center gap-2 justify-center"
                            @click="updateSetting"
                        >
                            {{ 'Lưu' }}
                        </a-button>
                    </div>
                </div>
            </div>
            <a-form-model
                ref="form"
                :model="form"
                :rules="rules"
                layout="vertical"
                :colon="false"
            >
                <div class="grid grid-cols-1 md:grid-cols-12 mt-4 gap-5">
                    <div class="col-span-1 md:col-span-8">
                        <div class="card">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Tên công ty' }}
                            </h4>
                            <div class="flex gap-4 items-center mt-2">
                                <a-input
                                    v-model="form.companyName"
                                    :placeholder="`Nhập tên công ty`"
                                />
                            </div>
                        </div>
                        <div class="card mt-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                Logo
                            </h4>
                            <h6 class="mt-4 mb-0 text-[14px]">
                                {{ 'Mặc định' }}
                            </h6>
                            <div class="flex gap-4 items-center mt-2 logo">
                                <a-upload
                                    name="avatar"
                                    list-type="picture-card"
                                    class="!w-[55px] !h-[55px]"
                                    :show-upload-list="false"
                                    action="https://api.synck.io.vn/api/uploads"
                                    @change="handleChangeLogo"
                                >
                                    <div v-if="loadingLogo" class="race-by" />
                                    <div v-else>
                                        <img
                                            v-if="previewImageLogo"
                                            class="h-full object-cover w-full"
                                            :src="previewImageLogo"
                                            alt="avatar"
                                        >
                                        <div v-else class="flex items-center justify-center flex-col">
                                            <svg
                                                class="w-6 h-6"
                                                style="fill: #53c66e"
                                                viewBox="0 0 23 21"
                                                xmlns="http://www.w3.org/2000/svg"
                                            ><path d="M18.5 0A1.5 1.5 0 0120 1.5V12c-.49-.07-1.01-.07-1.5 0V1.5H2v12.65l3.395-3.408a.75.75 0 01.958-.087l.104.087L7.89 12.18l3.687-5.21a.75.75 0 01.96-.086l.103.087 3.391 3.405c.81.813.433 2.28-.398 3.07A5.235 5.235 0 0014.053 18H2a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 012 0h16.5z" /><path d="M6.5 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM18.5 14.25a.75.75 0 011.5 0v2.25h2.25a.75.75 0 010 1.5H20v2.25a.75.75 0 01-1.5 0V18h-2.25a.75.75 0 010-1.5h2.25v-2.25z" /></svg>
                                        </div>
                                    </div>
                                </a-upload>
                                <div>
                                    <h4 class="m-0">
                                        {{ 'Logo trên hệ thống' }}
                                    </h4>
                                    <p class="m-0 text-[12px]">
                                        {{ 'Recommended: minimum 512x512 pixels.' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="card mt-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ $t('shared.description') }}
                            </h4>
                            <div class="flex gap-4 items-center mt-2">
                                <a-textarea
                                    v-model="form.descriptions"
                                    :placeholder="`Nhập mô tả của bạn`"
                                    :auto-size="{ minRows: 4, maxRows: 5 }"
                                />
                            </div>
                        </div>
                        <div class="card mt-4">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <h4 class="text-[14px] m-0 font-[600]">
                                        {{ 'Email' }}
                                    </h4>
                                    <div class="flex gap-4 items-center mt-2">
                                        <a-input
                                            v-model="form.email"
                                            :placeholder="`Nhập email để khách hàng liên hệ công ty`"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 class="text-[14px] m-0 font-[600]">
                                        {{ 'Password' }}
                                    </h4>
                                    <div class="flex gap-4 items-center mt-2">
                                        <a-input-password
                                            v-model="form.password"
                                            :placeholder="`Nhập Host email`"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 class="text-[14px] m-0 font-[600]">
                                        {{ 'Host' }}
                                    </h4>
                                    <div class="flex gap-4 items-center mt-2">
                                        <a-input
                                            v-model="form.host"
                                            :placeholder="`Nhập Host email`"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h4 class="text-[14px] m-0 font-[600]">
                                        {{ 'Port' }}
                                    </h4>
                                    <div class="flex gap-4 items-center mt-2">
                                        <a-input
                                            v-model="form.port"
                                            :placeholder="`Nhập port`"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mt-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Điện thoại' }}
                            </h4>
                            <div class="flex gap-4 items-center mt-2">
                                <a-input
                                    v-model="form.phone"
                                    :placeholder="`Nhập số điện thoại để khách hàng liên hệ công ty`"
                                />
                            </div>
                        </div>
                        <div class="card mt-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Trụ sở chính' }}
                            </h4>
                            <div class="flex gap-4 items-center mt-2">
                                <a-input
                                    v-model="form.headquarters"
                                    :placeholder="`Nhập địa chỉ trụ sở chính`"
                                />
                            </div>
                        </div>
                        <div class="card mt-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Chi nhánh' }}
                            </h4>
                            <div class="flex gap-4 items-center mt-2">
                                <a-input
                                    v-model="form.branch"
                                    :placeholder="`Nhập địa chỉ chi nhánh công ty`"
                                />
                            </div>
                        </div>
                        <div class="card mt-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Mã số thuế' }}
                            </h4>
                            <div class="flex gap-4 items-center mt-2">
                                <a-input
                                    v-model="form.tax"
                                    :placeholder="`Nhập mã số thuế công ty`"
                                />
                            </div>
                        </div>
                        <div class="card mt-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Số Fax' }}
                            </h4>
                            <div class="flex gap-4 items-center mt-2">
                                <a-input
                                    v-model="form.fax"
                                    :placeholder="`Nhập số fax công ty`"
                                />
                            </div>
                        </div>
                        <div class="card mt-4">
                            <h4 class="text-[14px] m-0 font-[600]">
                                {{ 'Website' }}
                            </h4>
                            <div class="flex gap-4 items-center mt-2">
                                <a-input
                                    v-model="form.website"
                                    :placeholder="`Nhập website công ty`"
                                />
                            </div>
                        </div><div class="card mt-4 social-form">
                            <div class="flex gap-4 items-start justify-between">
                                <div>
                                    <h4 class="text-[14px] m-0 font-[600] mb-1">
                                        {{ $t('setting.social_network_links') }}
                                    </h4>
                                    <p class="m-0">
                                        {{ $t('setting.social_links_for_your_business') }}
                                    </p>
                                </div>
                                <a-button
                                    type="primary"
                                    @click="addSocial"
                                >
                                    {{ $t('shared.add') }}
                                </a-button>
                            </div>
                            <div v-for="(social, index) in (form.socials || [])" :key="`social_${index}`" class="grid grid-cols-7 gap-4 mt-4 items-center">
                                <a-upload
                                    name="avatar"
                                    list-type="picture-card"
                                    class="!w-[55px] !h-[55px]  col-span-1 flex items-center justify-center"
                                    :show-upload-list="false"
                                    action="https://api.synck.io.vn/api/uploads"
                                    @change="(infor) => handleChangeSocial(infor, index)"
                                >
                                    <img
                                        v-if="socialIcons[index]"
                                        class="h-full object-cover w-full"
                                        :src="socialIcons[index]"
                                        alt="avatar"
                                    >
                                    <div v-else class="flex items-center justify-center flex-col">
                                        <div v-if="loadingSocialIcons" class="race-by" style="width: 35px;" />
                                        <svg
                                            v-else
                                            class="w-6 h-6"
                                            style="fill: #53c66e"
                                            viewBox="0 0 23 21"
                                            xmlns="http://www.w3.org/2000/svg"
                                        ><path d="M18.5 0A1.5 1.5 0 0120 1.5V12c-.49-.07-1.01-.07-1.5 0V1.5H2v12.65l3.395-3.408a.75.75 0 01.958-.087l.104.087L7.89 12.18l3.687-5.21a.75.75 0 01.96-.086l.103.087 3.391 3.405c.81.813.433 2.28-.398 3.07A5.235 5.235 0 0014.053 18H2a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 012 0h16.5z" /><path d="M6.5 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM18.5 14.25a.75.75 0 011.5 0v2.25h2.25a.75.75 0 010 1.5H20v2.25a.75.75 0 01-1.5 0V18h-2.25a.75.75 0 010-1.5h2.25v-2.25z" /></svg>
                                    </div>
                                </a-upload>
                                <a-input
                                    v-model="social.name"
                                    class="col-span-3 "
                                    :placeholder="$t('setting.store_setting.enter_name_social')"
                                    @change="({target}) => handleChangeNameSocial(index, target.value)"
                                />
                                <a-input
                                    v-model="social.link"
                                    class="col-span-3 "
                                    :placeholder="$t('setting.store_setting.enter_link_social')"
                                    @change="({target}) => handleChangeLinkSocial(index, target.value)"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="card h-fit col-span-1 md:col-span-4">
                        <PreviewBrand :form="form" />
                        <div>
                            <div class="mt-4">
                                <span class="text-[13px] mb-1 block font-bold">Màu chính</span>
                                <div class="flex items-center border-[1px] border-solid border-gray-40 p-2 rounded-sm relative">
                                    <input
                                        v-model="form.primaryColor"
                                        :class="`w-[25px] h-[25px] !bg-[${form.primaryColor}] rounded-[4px] border-image input-color`"
                                        default-value="#ffffff"
                                        type="color"
                                        @input="({target}) => handleChangeColor(target.value, 'primaryColor')"
                                    >
                                    <input
                                        v-model="form.primaryColor"
                                        placeholder="Default color is #fffff"
                                        class="flex-1 border-none outline-none pl-2 h-[25px]"
                                        @change="({target}) => handleChangeColor(target.value, 'primaryColor')"
                                    >
                                </div>
                            </div>
                            <div class="mt-4">
                                <span class="text-[13px] mb-1 block font-bold">Màu phụ</span>
                                <div class="flex items-center border-[1px] border-solid border-gray-40 p-2 rounded-sm relative">
                                    <input
                                        v-model="form.secondaryColor"
                                        :class="`w-[25px] h-[25px] !bg-[${form.secondaryColor}] rounded-[4px] border-image input-color`"
                                        default-value="#ffffff"
                                        type="color"
                                        @input="({target}) => handleChangeColor(target.value, 'secondaryColor')"
                                    >
                                    <input
                                        v-model="form.secondaryColor"
                                        placeholder="Default color is #fffff"
                                        class="flex-1 border-none outline-none pl-2 h-[25px]"
                                        @change="({target}) => handleChangeColor(target.value, 'secondaryColor')"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a-form-model>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import _cloneDeep from 'lodash/cloneDeep';
    import _omit from 'lodash/omit';
    import PreviewBrand from '@/components/settings/informations/PreviewBrand.vue';

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    export default {
        components: {
            PreviewBrand,
        },

        async fetch() {
            await this.fetchData();
        },

        data() {
            return {
                loading: false,
                loadingUpdate: false,
                loadingSocialIcons: false,
                loadingLogo: false,
                previewImageLogo: '',
                loadingFavicon: false,
                previewImageFavicon: '',
                loadingCover: false,
                previewCover: false,
                socialIcons: [],
                previewImage: '',
                rules: {},
                form: {
                    socials: [
                    ],
                },
            };
        },
        computed: {
            ...mapState('settings/contacts', ['contacts']),
        },

        watch: {
            contacts() {
                if (!this.form._id) {
                    this.form = this._cloneDeep(this.contacts);
                    this.previewImageLogo = this.form.logo;
                    this.previewImageFavicon = this.form.favicon;
                    this.previewCover = this.form.cover;
                    this.socialIcons = this.form.socials?.map((e) => e.icon);
                }
            },
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Cài đặt',
                link: '/settings',
            }, {
                label: 'Thông tin liên hệ',
                link: '/settings/contact',
            }]);
            if (this.contacts) {
                this.form = this._cloneDeep({
                    ...this.contacts,
                    password: this.contacts?.configMail?.auth?.pass,
                    host: this.contacts?.configMail?.host,
                    port: this.contacts?.configMail?.port,
                    auth: this.contacts?.configMail?.auth?.user,
                });
                this.previewImageLogo = this.contacts.logo;
                this.previewImageFavicon = this.contacts.favicon;
                this.previewCover = this.contacts.cover;
            }
        },
        methods: {
            _cloneDeep,
            async fetchData() {
                try {
                    this.loading = true;
                    if (this.contacts === null) {
                        await this.$store.dispatch('settings/contacts/fetchDetail');
                    }
                    this.form = this._cloneDeep({
                        ...this.contacts,
                        password: this.contacts?.configMail?.auth?.pass,
                        host: this.contacts?.configMail?.host,
                        port: this.contacts?.configMail?.port,
                        auth: this.contacts?.configMail?.auth.user,
                    });
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            handleChangeLogo(info) {
                if (info.file.status === 'uploading') {
                    this.loadingLogo = true;
                    return;
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, (imageUrl) => {
                        this.previewImageLogo = imageUrl;
                    });
                    this.loadingLogo = false;
                    this.form.logo = info?.file?.response?.data.fileAttributes[0]?.source;
                }
            },
            handleChangeFavicon(info) {
                if (info.file.status === 'uploading') {
                    this.loadingFavicon = true;
                    return;
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, (imageUrl) => {
                        this.previewImageFavicon = imageUrl;
                        this.loadingFavicon = false;
                    });
                    this.form.favicon = info?.file?.response?.data.fileAttributes[0]?.source;
                }
            },
            handleChangeSocial(info, index) {
                if (info.file.status === 'uploading') {
                    this.loadingSocialIcons = true;
                    return;
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, (imageUrl) => {
                        this.previewImage = imageUrl;
                        this.loadingSocialIcons = false;
                    });
                    this.socialIcons = [...this.socialIcons, info?.file?.response?.data.fileAttributes[0]?.source];
                    this.form.socials[index].icon = info?.file?.response?.data.fileAttributes[0]?.source;
                }
            },
            handleChangeCover(info) {
                if (info.file.status === 'uploading') {
                    this.loadingCover = true;
                    return;
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, (imageUrl) => {
                        this.previewCover = imageUrl;
                        this.loadingCover = false;
                    });
                    this.form.cover = info?.file?.response?.data.fileAttributes[0]?.source;
                }
            },
            handleChange(info) {
                if (info.file.status === 'uploading') {
                    this.loading = true;
                    return;
                }
                if (info.file.status === 'done') {
                    getBase64(info.file.originFileObj, (imageUrl) => {
                        this.previewImage = imageUrl;
                        this.loading = false;
                    });
                    this.form.thumbnail = info?.file?.response?.data.fileAttributes[0]?.source;
                }
            },

            addSocial() {
                this.form.socials = [...(this.form.socials || []), {
                    icon: '',
                    link: '',
                    name: '',
                }];
                this.$forceUpdate();
            },

            handleChangeColor(value, key) {
                this.form[key] = value;
            },

            handleChangeNameSocial(index, value) {
                this.form.socials[index].name = value;
                this.$forceUpdate();
            },

            handleChangeLinkSocial(index, value) {
                this.form.socials[index].link = value;
                this.$forceUpdate();
            },

            async updateSetting() {
                try {
                    this.loadingUpdate = true;
                    await this.$store.dispatch('settings/contacts/update', _omit({
                        ...this.form,
                        configMail: {
                            host: this.form.host,
                            port: this.form.port,
                            auth: {
                                user: this.form.email,
                                pass: this.form.password,
                            },
                        },
                    }, ['_id']));
                    this.$message.success('Cập nhật thành công');
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingUpdate = false;
                }
            },
        },

        head() {
            return {
                title: 'Thông tin liên hệ',
            };
        },
    };
</script>
<style lang="scss">
.logo {
    .race-by {
        width: 35px;
    }
}
.cover-images {
    .ant-upload-select-picture-card {
        width: 100%;
        span {
            width: 100% !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
        }
    }
}
.social-form {
    .ant-upload.ant-upload-select-picture-card > .ant-upload {
        padding: 15px;
    }
}
</style>
