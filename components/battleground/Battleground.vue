<template>
    <div class="sea">
        <div class="letters">
            <span>А</span>
            <span>Б</span>
            <span>В</span>
            <span>Г</span>
            <span>Д</span>
            <span>Е</span>
            <span>Ж</span>
            <span>З</span>
            <span>И</span>
            <span>К</span>
        </div>
        <div class="figures">
            <span v-for="i in 10">{{i}}</span>
        </div>
        <div class="field">
            <Row v-for="(row, ind) in data" :x="ind" :key="ind">
                <Cell v-for="(cell, indx) in row" :y="indx" :x="ind" :cell="cell" :key="`${ind}_${indx}`"
                      :myField="myField"/>
            </Row>
        </div>
    </div>
</template>

<script>
    import Row from '@/components/battleground/Row'
    import Cell from '@/components/battleground/Cell'

    export default {
        components: {
            Row,
            Cell
        },
        props: [
            'myField'
        ],
        data() {
            return {
                data: [],
            }
        },
        mounted() {
            this.data = this.$store.state.globalData
        },
    }
</script>

<style lang="less" scoped>
    .sea {
        position: relative;
        background: url('../../assets/img/sea.png') no-repeat top center;
        width: 641px;
        height: 645px;
    }

    .field {
        width: 450px;
        height: 450px;
        display: flex;
        flex-direction: column;
        transform: rotateX(60deg) rotateZ(44.9deg) translate(-21px, -156px);
    }

    .letters {
        position: absolute;
        display: flex;
        flex-direction: column;
        color: rgba(255, 255, 255, .46);
        right: 147px;
        transform: rotate(-64deg);
        height: 361px;
        justify-content: space-around;
        top: -113px;

        span {
            transform: rotate(65deg);
            font-weight: 700;
            font-size: 11px;
        }
    }

    .figures {
        position: absolute;
        display: flex;
        flex-direction: column;
        color: rgba(255, 255, 255, .46);
        left: 147px;
        transform: rotate(64deg);
        height: 361px;
        justify-content: space-around;
        top: -113px;

        span {
            transform: rotate(-65deg);
            font-weight: 700;
            font-size: 11px;
        }
    }
</style>