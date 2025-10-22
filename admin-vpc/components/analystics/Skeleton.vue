<template>
    <div class="card-loading mt-2">
        <div class="card-img-loading skeleton-loading">
            <!-- waiting for img to load from javascript -->
        </div>
    </div>
</template>
<style lang="scss">
.card-loading {
display: flex;
flex-direction: column;
flex-basis: 300px;
flex-shrink: 0;
flex-grow: 0;
max-width: 100%;
background-color: #FFF;
border-radius: 10px;
overflow: hidden;
height: 100%;
}

.card-img-loading {
padding-bottom: 56.25%;
position: relative;
}
.card-img-loading img {
    position: absolute;
    width: 100%;
}
.skeleton-loading {
background-color: #f4f4f4;
background-image:
        linear-gradient(
            90deg,
            rgba(#fff, 0),
            rgba(#fff, 0.5),
            rgba(#fff, 0)
        );
background-size: 40px 100%; // width of the shine
background-repeat: no-repeat; // No need to repeat the shine effect
background-position: left -40px top 0; // Place shine on the left side, with offset on the left based on the width of the shine - see background-size
animation: shine 1s ease infinite; // increase animation time to see effect in 'slow-mo'
}

@keyframes shine {
to {
    // Move shine from left to right, with offset on the right based on the width of the shine - see background-size
    background-position: right -40px top 0;
}
}
</style>
