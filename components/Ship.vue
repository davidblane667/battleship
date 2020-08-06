<template>
    <div>
        <drag class="ship"
              :class="`ship-${shipLength}`"
              :transfer-data="{shipLength, id}"
              :id="id"
        ></drag>
    </div>
</template>

<script>
    import {Drag, Drop} from 'vue-drag-drop';

    export default {
        components: {
            Drop,
            Drag
        },
        props: [
            'shipLength',
            'shipNumber'
        ],
        data() {
            return {
                id: '',
            }
        },
        mounted() {
            this.id = 'ship' + this.shipLength + '-' + this.shipNumber
        },
    }
</script>

<style lang="less">

    .ship-4 {
        top: 100px;
        background: url('../assets/img/cell-4.png') no-repeat;
        width: 143px;
        height: 106px;
        left: 0;
    }

    .ship-3 {
        top: 230px;
        background: url('../assets/img/cell-3.png') no-repeat;
        width: 100px;
        height: 63px;
        left: 0;
    }

    .ship-2 {
        top: 330px;
        background: url('../assets/img/cell-2.png') no-repeat;
        width: 73px;
        height: 47px;
        left: 0;
    }

    .ship-1 {
        top: 430px;
        background: url('../assets/img/cell-1.png') no-repeat;
        width: 44px;
        height: 24px;
        left: 0;
    }

    .ship {
        position: absolute;
        z-index: 100;
    }

    #ship3-2 {
        left: 120px;
    }

    #ship2-2 {
        left: 100px;
    }

    #ship2-3 {
        left: 200px;
    }

    #ship1-2 {
        left: 60px;
    }

    #ship1-3 {
        left: 120px;
    }

    #ship1-4 {
        left: 180px;
    }
</style>