<template>
    <div>
        <div class="flex items-center">
            <a-input v-model="content" class="w-[200px]" />
            <a-button type="primary" @click="send">
                Send
            </a-button>
        </div>
    </div>
</template>

<script>
    // import { mapState } from 'vuex';
    import moment from 'moment';
    import { io } from 'socket.io-client';
    // import Skeleton from '@/components/analystics/Skeleton.vue';

    export default {
        components: {
            // Skeleton,
        },

        async fetch() {
            this.fetchBlogs();
        },

        data() {
            return {
                loading: false,
                content: '',
            };
        },

        computed: { // Compute the token without the Bearer prefix
            bearerToken() {
                // Get the full token (including the prefix) from the auth module
                const fullToken = this.$auth.strategy.token.get();

                // If the token starts with "Bearer ", remove the prefix
                if (fullToken && fullToken.startsWith('Bearer ')) {
                    return fullToken.substring(7); // Remove "Bearer " prefix
                }

                // Return the full token if no prefix or no token
                return fullToken;
            },
            // ...mapState('dashboard', ['metrics']),
            // ...mapState('systems/blogs', ['blogs']),
        },

        watch: {
        },

        mounted() {
            this.$store.commit('breadcrumbs/SET_BREADCRUMBS', [{
                label: 'Dev Zone',
                link: '/dev_zone',
            }]);

            this.socket = io('wss://api.gensi.vn', {
                reconnectionDelayMax: 10000,
                auth: {
                    token: this.bearerToken,
                },
                query: {
                    'my-key': 'my-value',
                },
            });
        },

        methods: {
            moment,
            send() {
                /* Emit events */
                console.log('call socket');
                this.socket.on('hello', (arg) => {
                    console.log('---------on hello');
                    console.log(arg);
                    console.log('---------on hello');
                });
                this.socket.emit('comment', this.content);
            },
            async fetchMetrics() {
                try {
                    this.loading = true;
                    if (this.metrics === null) {
                        // await this.$store.dispatch('dashboard/fetchMetrics');
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loading = false;
                }
            },
            async fetchBlogs() {
                try {
                    this.loadingBlog = true;
                    if (this.blogs === null) {
                        // await this.$store.dispatch('systems/blogs/fetchAll');
                    }
                } catch (error) {
                    this.$handleError(error);
                } finally {
                    this.loadingBlog = false;
                }
            },

            handleOpenWindow(link) {
                window.open(link, '_blank');
            },
        },

        head() {
            return {
                title: 'Dev Zone',
            };
        },
    };
</script>
<style lang="scss" scoped>
</style>
