<template>
    <div class="statistic-inner">
        <div class="title">
            <h2>{{title}}<span> повреждения {{destroyScore}}</span></h2>
        </div>
        <div class="row">
            <div class="ship-statistic">
                <div class="cell" v-for="(cell, ind) in 4" :class="{destr: ship41[ind] || ''}"></div>
            </div>
        </div>
        <div class="row">
            <div class="ship-statistic">
                <div class="cell" v-for="(cell, ind) in 3" :class="{destr: ship31[ind] || ''}"></div>
            </div>
            <div class="ship-statistic">
                <div class="cell" v-for="(cell, ind) in 3" :class="{destr: ship32[ind] || ''}"></div>
            </div>
        </div>
        <div class="row">
            <div class="ship-statistic">
                <div class="cell" v-for="(cell, ind) in 2" :class="{destr: ship21[ind] || ''}"></div>
            </div>
            <div class="ship-statistic">
                <div class="cell" v-for="(cell, ind) in 2" :class="{destr: ship22[ind] || ''}"></div>
            </div>
            <div class="ship-statistic">
                <div class="cell" v-for="(cell, ind) in 2" :class="{destr: ship23[ind] || ''}"></div>
            </div>
        </div>
        <div class="row">
            <div class="ship-statistic">
                <div class="cell" :class="{destr: ship11[0] || ''}"></div>
            </div>
            <div class="ship-statistic">
                <div class="cell" :class="{destr: ship12[0] || ''}"></div>
            </div>
            <div class="ship-statistic">
                <div class="cell" :class="{destr: ship13[0] || ''}"></div>
            </div>
            <div class="ship-statistic">
                <div class="cell" :class="{destr: ship14[0] || ''}"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'title',
            'isMy'
        ],
        data() {
            return {
                localData: [],
                score: 0,
                ship41: [],
                ship31: [],
                ship32: [],
                ship21: [],
                ship22: [],
                ship23: [],
                ship11: [],
                ship12: [],
                ship13: [],
                ship14: [],
            }
        },
        mounted() {
            setInterval(() => {
                this.destroyedShip()
                const status = this.$store.getters['server/getStatusGame']()
                if (status === '3' && this.isMy) {
                    const score = this.destroyScore
                    if (score !== '100%') {
                        alert(`Вы победили!`)
                    } else {
                        alert('Вы проиграли :(')
                    }
                }
            }, 5000)
        },
        computed: {
            destroyScore() {
                return this.score * 5 + '%'
            }
        },
        methods: {
            destroyedShip() {
                let data
                if (this.isMy) {
                    data = this.$store.getters['server/getDestroyedShipsMy']()
                } else {
                    data = this.$store.getters['server/getDestroyedShipsEnemy']()
                }
                this.score = 0
                this.ship41 = []
                this.ship31 = []
                this.ship32 = []
                this.ship21 = []
                this.ship22 = []
                this.ship23 = []
                this.ship11 = []
                this.ship12 = []
                this.ship13 = []
                this.ship14 = []

                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].length; j++) {
                        if (data[i][j][0] !== 'empty' && data[i][j][0] !== 'hidden' && data[i][j][1] === 1) {
                            switch (data[i][j][0]) {
                                case '4-1':
                                    this.ship41.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '3-1':
                                    this.ship31.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '3-2':
                                    this.ship32.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '2-1':
                                    this.ship21.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '2-2':
                                    this.ship22.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '2-3':
                                    this.ship23.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '1-1':
                                    this.ship11.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '1-2':
                                    this.ship12.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '1-3':
                                    this.ship13.push(data[i][j][0])
                                    this.score++
                                    break;
                                case '1-4':
                                    this.ship14.push(data[i][j][0])
                                    this.score++
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .statistic-inner {
        max-width: 300px;
        width: 100%;
        margin-right: 257px;
        transform: translateZ(10px);

        .title {
            color: #fff;
            margin-bottom: 20px;

            h2 {
                font-size: 22px;
                font-weight: 700;
            }

            span {
                font-weight: 400;
                font-size: 14px;
            }
        }

        .row {
            width: 100%;
            display: flex;
            margin-top: 10px;

            .ship-statistic {
                display: flex;
                justify-content: flex-start;
                margin-right: 20px;

                .cell {
                    width: 22px;
                    height: 17px;
                    background: #fff;
                    margin-right: 2px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
                .destr {
                    opacity: .5;
                }
            }
        }
    }
</style>