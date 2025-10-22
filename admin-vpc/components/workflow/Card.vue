<template>
    <div data-id="${d.data.id}">
        <div class="orgchart-node" style="">
            <div class="header-card-trigger" />
            <div style="padding:12px; display:flex; align-items: center;height:100%; gap: 8px">
                <div><img src=" ${d.data.avatar}" style="object-fit:cover; border-radius:100px;min-width:40px;width:40px;height:40px;"></div>
                <div>
                    <div style="font-size:15px; color:#08011E; width:fit-content">
                        ok
                    </div>
                    <div style="color:#716E7B;margin-top:3px;font-size:10px;">
                        hello
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            data: {
                type: Object,
                default: () => {},
            },
        },
    };
</script>

<style lang="scss">

.header-card-trigger {
    height: 20px;
    width: 100%;
    background: red;
}
.orgchart-node {
    font-family: 'Be Vietnam Pro', sans-serif;
    background-color: #fff;
    margin-left:-1px;
    border-radius:10px;
    border: 1px solid #E4E2E9
}</style>
