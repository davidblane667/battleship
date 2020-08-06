<template>
    <div class="row" :id="`row-${x}`">
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

        &:first-child {
            border-top: 1px solid transparent;
        }
    }
</style>