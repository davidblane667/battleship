<template>
    <div class="row transparent" v-if="x === 0" :id="`row-${x}`">
        <slot/>
    </div>
    <div class="row" v-else :id="`row-${x}`">
        <slot/>
    </div>
</template>

<script>
    export default {
        props: [
            'transparent',
            'x'
        ]
    }
</script>

<style lang="less" scoped>
    .row {
        display: flex;
        height: 45px;
        border-top: 1px solid rgba(255, 255, 255, .46);
    }

    .transparent {
        border-top: 1px solid transparent;
    }
</style>