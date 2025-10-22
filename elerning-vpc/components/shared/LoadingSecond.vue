<template>
    <div class="continuous-4" />
</template>

<script>
    export default {
        props: {
            scroll: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                isScroll: false,
            };
        },
        methods: {
            scrollToTop() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        },
    };
</script>
<style>
.continuous-4 {
    width: 120px;
    height: 22px;
    border-radius: 40px;
    color: #1877f2;
    border: 2px solid;
    position: relative;
    overflow: hidden;
    margin: 0 auto;
}

.continuous-4::before {
  content: "";
  position: absolute;
  margin: 2px;
  width: 14px;
  top: 0;
  bottom: 0;
  left: -20px;
  border-radius: inherit;
  background: currentColor;
  box-shadow: -10px 0 12px 3px currentColor;
  clip-path: polygon(0 5%, 100% 0,100% 100%,0 95%,-30px 50%);
  animation: ct4 1s infinite linear;
}

@keyframes ct4 {
  100% {left: calc(100% + 20px)}
}
</style>
