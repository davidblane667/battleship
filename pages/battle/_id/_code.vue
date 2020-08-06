<template>
    <div class="content">
        <div class="notification" v-if="myTurn">Твой ход, тысяча чертей!</div>
        <div class="content-left">

            <div class="ship ship4" id="ship4-1"></div>

            <div class="ship ship3" id="ship3-1"></div>
            <div class="ship ship3" id="ship3-2"></div>

            <div class="ship ship2" id="ship2-1"></div>
            <div class="ship ship2" id="ship2-2"></div>
            <div class="ship ship2" id="ship2-3"></div>

            <div class="ship ship1" id="ship1-1"></div>
            <div class="ship ship1" id="ship1-2"></div>
            <div class="ship ship1" id="ship1-3"></div>
            <div class="ship ship1" id="ship1-4"></div>

            <Battleground :myField="true"/>
        </div>
        <div class="content-right">
            <Battleground :myField="false"/>
        </div>
        <div class="statistic">
            <Statistic title="Твой флот" :isMy="true"/>
            <Statistic title="Флот врага" :isMy="false"/>
        </div>
        <Chat/>
    </div>
</template>

<script>
    import Ship from '@/components/Ship'
    import Battleground from '@/components/battleground/index'
    import Statistic from '@/components/Statistic'
    import Chat from '@/components/Chat'

    export default {
        async fetch({store, params}) {
            await store.dispatch('server/fetch', {id: params.id, code: params.code});
        },
        components: {
            Ship,
            Battleground,
            Statistic,
            Chat
        },
        data() {
            return {
                localData: [],
                myTurn: ''
            }
        },
        mounted() {
            this.localData = this.$store.getters['server/expandAllData']();
            setTimeout(() => {
                this.setShipsFromServer(this.localData)
            }, 0);
            this.myTurn = this.$store.getters['server/isMyTurn']();
            setInterval(() => {
                this.getIntervalData();
                this.myTurn = this.$store.getters['server/isMyTurn']();
                this.setShotingMy()
            }, 5000)
        },
        methods: {
            async getIntervalData() {
                const {id, code} = this.$route.params;
                await this.$store.dispatch('server/fetch', {id: id, code: code})
            },
            setShotingMy() {
                const myData = this.$store.state.server.game.fieldMy;
                const enemyData = this.$store.state.server.game.fieldEnemy;

                for (let i = 0; i < myData.length; i++) {
                    for (let j = 0; j < myData[i].length; j++) {
                        const cell = document.getElementById(`${j}${i}`);
                        if (myData[i][j][0] !== 'empty' && myData[i][j][1] !== 0) {
                            cell.classList.add('shot')
                        } else if (myData[i][j][0] === 'empty' && myData[i][j][1] !== 0) {
                            cell.classList.add('shot-miss')
                        }
                    }
                }
                for (let i = 0; i < enemyData.length; i++) {
                    for (let j = 0; j < enemyData[i].length; j++) {
                        const cell = document.getElementById(`enemy${j}${i}`);
                        if (enemyData[i][j][0] !== 'empty' && enemyData[i][j][1] !== 0) {
                            cell.classList.add('shot')
                        } else if (enemyData[i][j][0] === 'empty' && enemyData[i][j][1] !== 0) {
                            cell.classList.add('shot-miss')
                        }
                    }
                }
            },
            setShipsFromServer(data) {
                data.forEach(ship => {
                    if (ship.orientation === 'vertical') {
                        this.setShipImgFromServer({
                            x: ship.y,
                            y: ship.x,
                            id: `ship${ship.shipId}`,
                            shipOrientation: 'vertical',
                            shipLength: +ship.length
                        });
                        this.setShipVertical({x: ship.x, y: ship.y, shipLength: ship.length, id: ship.shipId})
                    } else {
                        this.setShipImgFromServer({
                            x: ship.y,
                            y: ship.x,
                            id: `ship${ship.shipId}`,
                            shipOrientation: 'horizontal',
                            shipLength: +ship.length
                        });
                        this.setShip({x: ship.x, y: ship.y, shipLength: ship.length, id: ship.shipId})
                    }
                })
            },
            setShipImgFromServer(options) {
                const cordX = document.getElementById(`${options.x}${options.y}`).getBoundingClientRect().left;
                const cordY = document.getElementById(`${options.x}${options.y}`).getBoundingClientRect().top;

                const shipElem = document.getElementById(`${options.id}`);

                if (options.shipOrientation === 'vertical') {
                    shipElem.style.transform = 'rotateZ(180deg) rotateX(180deg)';

                    if (options.id === 'ship4-1') {
                        shipElem.style.top = cordY - 107 + 'px';
                        shipElem.style.left = cordX - 470 + 'px'
                    } else if (options.shipLength === 3) {
                        shipElem.style.top = cordY - 83 + 'px';
                        shipElem.style.left = cordX - 430 + 'px'
                    } else if (options.shipLength === 2) {
                        shipElem.style.top = cordY - 82 + 'px';
                        shipElem.style.left = cordX - 400 + 'px'
                    } else {
                        shipElem.style.transform = '';
                        shipElem.style.top = cordY - 77 + 'px';
                        shipElem.style.left = cordX - 370 + 'px'
                    }

                } else {
                    shipElem.style.transform = '';

                    if (options.id === 'ship4-1') {
                        shipElem.style.top = cordY - 107 + 'px'
                    } else if (options.shipLength === 3) {
                        shipElem.style.top = cordY - 83 + 'px';
                        shipElem.style.left = cordX - 420 + 'px'
                    } else if (options.shipLength === 2) {
                        shipElem.style.top = cordY - 81 + 'px';
                        shipElem.style.left = cordX - 370 + 'px'
                    } else {
                        shipElem.style.top = cordY - 77 + 'px'
                    }
                    shipElem.style.left = cordX - 370 + 'px'

                }
            },
            setShip(options) {
                const x = options.x;
                const y = options.y;
                const length = options.shipLength;

                for (let i = x - 1; i <= x + 1; i++) {
                    for (let j = y - 1; j <= y + length; j++) {
                        if ((i >= 0 && j >= 0) && (i <= 9 && j <= 9)) {
                            if ((i === x && j === y) || (i === x && j <= (y + length - 1) && j >= y)) {
                                this.$store.dispatch('setShip', {
                                    x: i,
                                    y: j,
                                    isShip: true,
                                    id: options.id,
                                    orientation: 'horizontal'
                                })
                            } else {
                                this.$store.dispatch('setShip', {x: i, y: j})
                            }
                        }
                    }
                }
            },
            setShipVertical(options) {
                const x = options.x;
                const y = options.y;
                const length = options.shipLength;

                for (let i = x - 1; i <= x + length; i++) {
                    for (let j = y - 1; j <= y + 1; j++) {
                        if ((i >= 0 && j >= 0) && (i <= 9 && j <= 9)) {
                            if ((i === x && j === y) || (i <= (x + length - 1) && i >= x && j === y)) {
                                this.$store.dispatch('setShip', {
                                    x: i,
                                    y: j,
                                    isShip: true,
                                    id: options.id,
                                    orientation: 'vertical'
                                })
                            } else {
                                this.$store.dispatch('setShip', {x: i, y: j})
                            }
                        }
                    }
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .content {
        padding-top: 80px;
        position: relative;
    }

    .content-left {
        position: absolute;
        top: 3px;
        left: 0;
        width: 50%;
    }

    .content-right {
        position: absolute;
        top: 80px;
        right: 0;
        width: 50%;
    }

    .content-left .row {
        display: flex;
        justify-content: flex-start;
        margin-top: 50px;
    }

    .statistic {
        padding-top: 320px;
        display: flex;
        justify-content: space-between;
    }

    .ship4 {
        top: 100px;
        background: url('../../../assets/img/cell-4.png') no-repeat;
        width: 143px;
        height: 106px;
        left: 0;
    }

    .ship3 {
        top: 230px;
        background: url('../../../assets/img/cell-3.png') no-repeat;
        width: 100px;
        height: 63px;
        left: 0;
    }

    .ship2 {
        top: 330px;
        background: url('../../../assets/img/cell-2.png') no-repeat;
        width: 73px;
        height: 47px;
        left: 0;
    }

    .ship1 {
        top: 430px;
        background: url('../../../assets/img/cell-1.png') no-repeat;
        width: 44px;
        height: 24px;
        left: 0;
    }

    .notification {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        font-weight: 700;
        font-size: 24px;
        line-height: 22px;
        color: #000;
        padding: 20px;
        background: #ffcc00;
        transition: all .3s;
        animation-name: slide-bottom-from-top;
        animation-timing-function: ease-in-out;
        animation-delay: 1.5s;
        animation-duration: 2.5s;
    }

    @keyframes slide-bottom-from-top {
        from {
            opacity: 0;
            top: 0;
        }

        to {
            opacity: 0;
            top: 100%;
        }

        50% {
            opacity: 1;
            top: 40%;
        }
    }
</style>
