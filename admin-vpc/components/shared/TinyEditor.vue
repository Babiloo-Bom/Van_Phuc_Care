<template>
    <div id="editor-post" class="light-mode-editor">
        <p class="text-black font-bold mb-1">
            {{ title }} <span style="color:red">*</span>
        </p>
        <div ref="editorContainer" class="tiny-editor">
            <Editor
                v-if="status"
                :id="elementId"
                ref="editor"
                v-model="contentData"
                :api-key="KEY"
                :init="inital"
                :disabled="disabled"
                :value="contentData"
                :config="{}"
                class="app-editor h-full"
                plugins="lists code"
                :placeholder="placeholder"
            />
            <a-modal
                title="Media"
                :visible.sync="imageFinderVisible"
                width="600px"
                :destroy-on-close="true"
                :footer="false"
                @cancel="close"
            >
                <UploadFile
                    type="image"
                    @confirmPick="confirmPickImage"
                    @upload="uploadImage"
                    @close="close"
                />
            </a-modal>
            <a-modal
                title="Audio"
                :visible.sync="audioFinderVisible"
                width="600px"
                :destroy-on-close="true"
                :footer="false"
                @cancel="close"
            >
                <UploadFile
                    type="audio"
                    @confirmPick="confirmPickAudio"
                    @upload="uploadAudio"
                    @close="close"
                />
            </a-modal>
            <a-modal
                title="Video"
                :visible.sync="videoFinderVisible"
                width="600px"
                :destroy-on-close="true"
                :footer="false"
                @cancel="close"
            >
                <UploadFile
                    type="video"
                    @confirmPick="confirmPickVideo"
                    @upload="uploadVideo"
                    @close="close"
                />
            </a-modal>
        </div>
    </div>
</template>

<script>
    import Editor from '@tinymce/tinymce-vue';
    import { mapState } from 'vuex';
    import { image as toImage } from '@/utils/url';
    import UploadFile from '@/components/shared/ImageFinder.vue';

    const KEY = process.env.TINYMCE_KEY;
    export default {
        components: {
            Editor,
            UploadFile,
        },

        model: {
            prop: 'value',
            event: 'input',
        },

        props: {
            value: String,
            height: {
                type: [String, Number],
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            inline: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '',
            },
            title: {
                type: String,
                default: 'Nội dung',
            },
        },

        data() {
            return {
                contentData: this.value,
                selected: '',
                elementId: this.uuidv4(),
                KEY,
                imageFinderVisible: false,
                audioFinderVisible: false,
                videoFinderVisible: false,
                status: false,
                image: null,
                audio: null,
                video: null,
            };
        },

        computed: {
            ...mapState('editor', ['reset']),
            inital() {
                const pickImagePlugin = (editor) => {
                    editor.ui.registry.addButton('myPickImageButton', {
                        icon: 'gallery',
                        onAction: () => {
                            this.elementId = editor.id;
                            this.imageFinderVisible = true;
                        },
                    });
                };

                const pickAudioPlugin = (editor) => {
                    editor.ui.registry.addButton('myPickAudioButton', {
                        icon: 'arrow-right',
                        onAction: () => {
                            this.elementId = editor.id;
                            this.audioFinderVisible = true;
                        },
                    });
                };

                const pickVideoPlugin = (editor) => {
                    editor.ui.registry.addButton('myPickVideoButton', {
                        icon: 'embed',
                        onAction: () => {
                            this.elementId = editor.id;
                            this.videoFinderVisible = true;
                        },
                    });
                };

                return {
                    selector: `#${this.elementId}`,
                    entity_encoding: 'raw',
                    htmlAllowedTags: ['.*'],
                    htmlAllowedAttrs: ['.*'],
                    draggable_modal: true,
                    content_style:
                        'body { color: black; font-size: 14px; font-family: "Lexend", sans-serif; }',
                    inline: this.inline,
                    fontsize_formats: '8px 10px 12px 14px 16px 18px 22px 24px 36px 48px 64px',
                    plugins: 'myPickImageButton myPickAudioButton myPickVideoButton preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media codesample table charmap pagebreak nonbreaking insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                    menubar: 'file edit view insert format tools table help',
                    // external_plugins: {
                    //     tiny_mce_wiris: 'https://www.wiris.net/demo/plugins/tiny_mce/plugin.js',
                    // },
                    // tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry
                    font_formats: 'Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | myPickImageButton myPickAudioButton myPickVideoButton link | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | table | charmap emoticons | fullscreen preview print',
                    toolbar_sticky: true,
                    toolbar_mode: 'sliding',
                    contextmenu: 'link image table',
                    table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
                    table_appearance_options: false,
                    table_grid: false,
                    table_resize_bars: true,
                    table_default_attributes: {
                        border: '1'
                    },
                    table_default_styles: {
                        'border-collapse': 'collapse',
                        'width': '100%'
                    },
                    height: this.height || this.$refs.editorContainer?.clientHeight || 350,
                    image_class_list: [
                        { title: 'None', value: '' },
                        { title: 'No border', value: 'img_no_border' },
                        { title: 'Green border', value: 'img_green_border' },
                        { title: 'Blue border', value: 'img_blue_border' },
                        { title: 'Red border', value: 'img_red_border' },
                    ],
                    setup(editor) {
                        window.tinymce.PluginManager.add('myPickImageButton', pickImagePlugin);
                        window.tinymce.PluginManager.add('myPickAudioButton', pickAudioPlugin);
                        window.tinymce.PluginManager.add('myPickVideoButton', pickVideoPlugin);

                        if (this.charLimit) {
                            editor.on('beforeinput', function (e) {
                                if (e.data !== null) {
                                    const charLimit = this.settings.charLimit;
                                    const tinyLen = this.getContent({ format: 'text' }).length;
                                    if (tinyLen >= charLimit) {
                                        e.preventDefault();
                                        this.notificationManager.open({
                                            text: `Nội dung không được vượt quá ${charLimit} ký tự`,
                                            type: 'warning',
                                            timeout: 2000,
                                            closeButton: true,
                                        });
                                    }
                                }
                            });
                        }
                    },
                    // paste_as_text: true,
                    // paste_auto_cleanup_on_paste: true,
                    // paste_remove_styles: true,
                    // paste_remove_styles_if_webkit: true,
                    // paste_strip_class_attributes: true,
                };
            },
        },

        watch: {
            value(val) {
                this.contentData = val;
            },
            contentData() {
                this.$emit('contentChange', this.contentData);
                this.$emit('input', this.contentData);
            },
            contentInsert() {
                this.contentData = this.contentInsert;
            },

            height() {
                const element = this.$refs.editorContainer.getElementsByClassName('tox tox-tinymce')[0];
                if (element) {
                    element.style.height = this.height;
                }
            },
        },

        mounted() {
            this.status = true;
        },

        destroyed() {
            this.status = false;
        },

        methods: {
            toImage,
            close() {
                this.imageFinderVisible = false;
                this.audioFinderVisible = false;
                this.videoFinderVisible = false;
            },
            confirmPickImage(name) {
                this.image = name;
            },
            uploadImage() {
                this.imageFinderVisible = false;
                window.tinymce.get(this.elementId).insertContent(`<img alt="${this.image}" src="${this.toImage(this.image, 'full')}"/>`);
            },

            confirmPickAudio(source) {
                this.audio = source;
            },

            uploadAudio() {
                this.audioFinderVisible = false;
                window.tinymce.get(this.elementId).insertContent(`<audio controls><source src="${this.audio}" type="audio/mp3"></audio>`);
            },

            confirmPickVideo(videoUrl) {
                this.video = videoUrl;
            },

            uploadVideo() {
                this.videoFinderVisible = false;

                window.tinymce.get(this.elementId).insertContent(`<video controls><source src="${this.video}"></video>`);
            },

            handleInput(value) {
                this.$emit('blur', this.reset ? '' : value);
            },

            insertContent(content) {
                window.tinymce.get(this.elementId).execCommand('mceInsertContent', false, content);
            },
            uuidv4() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                    // eslint-disable-next-line no-bitwise
                    const r = Math.random() * 16 | 0;
                    // eslint-disable-next-line
                    const v = c == 'x' ? r : (r & 0x3 | 0x8);

                    return v.toString(16);
                });
            },

        },
    };
</script>

<style lang="scss">
.editor {
    .tox-tinymce {
        border-radius: 4px !important;
    }
    .tox .tox-tbtn--bespoke .tox-tbtn__select-label {
        width: 3em !important;
    }
}

.ant-modal-footer {
    div {
        @apply flex;
    }
}

</style>
