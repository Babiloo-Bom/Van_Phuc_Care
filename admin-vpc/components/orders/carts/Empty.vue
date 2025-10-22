<template>
    <div class="card flex items-center justify-center gap-2 flex-col !pb-[50px]">
        <svg xmlns="http://www.w3.org/2000/svg" width="226" height="226" fill="none"><path d="M117 185c40.869 0 74-33.131 74-74 0-40.87-33.131-74-74-74-40.87 0-74 33.13-74 74 0 40.869 33.13 74 74 74z" fill="#F0F1F2"/><path d="M85 148h17l-6.182 17h-4.636L85 148zm51 0h17l-6.182 17h-4.636L136 148z" fill="#9FA5AB"/><path d="M66 74h98.5c2.013 0 3.343 2.066 2.805 4.01l-10.569 38.275a5.375 5.375 0 0 1-4.512 3.897l-62.078 7.688L66 74z" fill="#B6BABF"/><path d="M180.511 149c-12.931 21.566-36.535 36-63.511 36-26.976 0-50.58-14.434-63.511-36H180.51z" fill="#D2D5D9"/><path d="M83 65a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v26H85a2 2 0 0 1-2-2V65z" fill="#9FA5AB"/><path d="M83 63a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v11H83V63z" fill="#828A91"/><path d="M85.929 153c-3.124 0-6.291-1.467-8.764-3.853-3.003-2.898-4.799-7.037-4.799-11.072 0-.269.009-.53.026-.79.226-3.844 2.239-7.376 5.51-9.701l5.71-4.061L57.58 67.597l-17.858-5.615a3.882 3.882 0 0 1-2.543-4.868 3.882 3.882 0 0 1 4.868-2.542l19.481 6.126a3.879 3.879 0 0 1 2.352 2.065l28.114 60.404a3.884 3.884 0 0 1-1.266 4.798l-8.348 5.936c-1.328.946-2.17 2.377-2.256 3.835-.009.113-.009.226-.009.339 0 1.909.955 4.061 2.43 5.492.59.573 1.796 1.51 3.263 1.51H159c2.143 0 4 1.78 4 3.923s-1.857 4-4 4H85.929z" fill="#53c66e"/><path d="M93.5 174a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zm51 0a8.5 8.5 0 1 0-.001-17.001A8.5 8.5 0 0 0 144.5 174zM61.537 60.698l-19.49-6.118a3.882 3.882 0 0 0-4.868 2.543 3.882 3.882 0 0 0 2.543 4.868l17.493 5.501a74.87 74.87 0 0 1 5.259-6.317 3.669 3.669 0 0 0-.937-.477z" fill="#53c66e"/><path d="m90.35 93.09 4.143 27.221c.142.932 1 1.58 1.936 1.461l37.382-4.868a1.736 1.736 0 0 0 1.504-1.928l-3.338-27.965A1.736 1.736 0 0 0 130 85.5l-38.188 5.612a1.736 1.736 0 0 0-1.462 1.978z" fill="#9FA5AB"/><g filter="url(#a)"><path d="M162 101c17.179 0 31-13.82 31-31s-13.821-31-31-31c-17.179 0-31 13.82-31 31s13.821 31 31 31z" fill="#ff4d4f"/><path d="M173.962 61.474c.89-.89.89-2.545 0-3.436-.891-.89-2.545-.89-3.436 0l-20.488 20.488c-.89.89-.89 2.545 0 3.436.891.89 2.545.89 3.436 0l20.488-20.488z" fill="#fff"/><path d="M170.526 81.962c.891.89 2.545.89 3.436 0 .89-.891.89-2.546 0-3.436l-20.488-20.488c-.891-.89-2.545-.89-3.436 0-.89.891-.89 2.545 0 3.436l20.488 20.488z" fill="#fff"/></g><defs><filter id="a" x="121" y="31" width="82" height="82" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="5"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/><feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/></filter></defs></svg>
        <h3 class="font-semibold text-xl text-center">
            {{ $t('order.empty_abandoned_title') }}
        </h3>
        <p class="w-[50%] text-center">
            {{ $t('order.empty_abandoned_desc') }}
        </p>
    </div>
</template>

<script>

    export default {
        components: {
        },

        methods: {
        },
    };
</script>
