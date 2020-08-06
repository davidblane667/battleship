<template>
    <div class="main">
        <div class="clouds"></div>
        <div class="container">
            <Header/>
            <Nuxt/>
        </div>
    </div>
</template>

<script>
    import Header from '@/components/Header'

    export default {
        components: {
            Header
        }
    }
</script>

<style lang="less">
    html {
        box-sizing: border-box;
        font-family: 'PT Sans', sans-serif;
        font-weight: 400;
        font-size: 14px;
    }

    body {
        background: #000;
    }

    a {
        display: inline-block;
    }

    *,
    *::before,
    *::after {
        box-sizing: border-box;
        margin: 0;
    }

    .main {
        min-height: 100vh;
        position: relative;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .container {
        max-width: 1197px;
        width: 100%;
        margin: 0 auto;
        padding: 0 20px;
        transform: translateZ(10px);
    }

    .clouds {
        background: url('../assets/img/clouds.png') repeat-x 0 0;
        width: 200%;
        height: 473px;
        position: absolute;
        animation-name: clouds-surf;
        animation-duration: 300s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-delay: -30s;
        animation-direction: normal;
        animation-fill-mode: none;
    }

    @keyframes clouds-surf {
        from {
            background-position: 0 0;
        }
        50% {
            background-position: -100% 0;

        }
        to {
            background-position: 0 0;
        }
    }
</style>
