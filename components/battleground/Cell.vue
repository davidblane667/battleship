<template>
    <div v-if="isBattleMy"
         class="cell"
         :id="`${x}${y}`"
         :class="variableCellClass"
    ></div>
    <div v-else-if="isBattle"
         class="battle-cell cell"
         :id="`enemy${x}${y}`"
         :class="variableCellClass"
         @click="shotHandle({x, y})"
         @mouseout="outCell({x: x, y: y})"
         @mouseover="enterCell({x: x, y: y})"
    >
        <span class="select-cords">{{`${letters[y]}${x + 1} - Пли!`}}</span>
    </div>
    <drop v-else
          class="drop cell"
          :id="`${x}${y}`"
          :class="{close: cell.isShip}"
          @drop="handleDrop"
    ></drop>
</template>

<script>
    import {Drag, Drop} from 'vue-drag-drop';
    import config from '../../nuxt.config.js'

    export default {
        components: {
            Drop,
            Drag
        },
        props: [
            'transparent',
            'x', 'y',
            'cell',
            'myField'
        ],
        data() {
            return {
                shipLength: null,
                orientation: false,
                shipCurrentId: null,
                letters: ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'],
                variableCellClass: ''
            }
        },
        computed: {
            isBattleMy() {
                return this.$route.path.indexOf('battle') !== -1 && this.myField
            },
            isBattle() {
                return this.$route.path.indexOf('battle') !== -1
            }
        },
        methods: {
            handleDrop(data) {
                this.shipLength = data.shipLength;
                this.orientation = false;
                this.shipCurrentId = data.id.slice(4);
                const currentId = data.id.slice(4);

                if (data.shipLength === 2 && this.y > 8) {
                    this.removeShip(currentId);
                    this.isClosedCell({x: this.x, y: this.y - 1, shipLength: data.shipLength, id: currentId})
                } else if (data.shipLength === 3 && this.y > 7) {
                    this.removeShip(currentId);
                    this.isClosedCell({x: this.x, y: this.y - 2, shipLength: data.shipLength, id: currentId})
                } else if (data.shipLength === 4 && this.y > 6) {
                    this.removeShip(currentId);
                    this.isClosedCell({x: this.x, y: this.y - 3, shipLength: data.shipLength, id: currentId})
                } else {
                    this.removeShip(currentId);
                    this.isClosedCell({x: this.x, y: this.y, shipLength: data.shipLength, id: currentId})
                }
            },
            setShipImg(options) {
                const cordX = document.getElementById(`${options.x}${options.y}`).getBoundingClientRect().left;
                const cordY = document.getElementById(`${options.x}${options.y}`).getBoundingClientRect().top;

                const shipElem = document.getElementById(`ship${options.id}`);

                if (this.orientation) {
                    shipElem.style.transform = 'rotateZ(180deg) rotateX(180deg)';

                    if (options.id === '4-1') {
                        shipElem.style.top = cordY - 30 + 'px';
                        shipElem.style.left = cordX - 450 + 'px'
                    } else if (this.shipLength === 3) {
                        shipElem.style.top = cordY + 'px';
                        shipElem.style.left = cordX - 400 + 'px'
                    } else {
                        shipElem.style.top = cordY + 'px';
                        shipElem.style.left = cordX - 375 + 'px'
                    }

                } else {
                    shipElem.style.transform = '';

                    if (options.id === '4-1') {
                        shipElem.style.top = cordY - 30 + 'px'
                    } else {
                        shipElem.style.top = cordY + 'px'
                    }
                    shipElem.style.left = cordX - 340 + 'px'

                }
            },
            setShip(options) {
                const x = options.x;
                const y = options.y;
                const length = options.shipLength;

                if (this.orientation) {
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
                } else {
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
                }

                const shipsData = this.$store.getters.compilationAllData();
                const ship = shipsData.filter(ship => ship.ship === options.id);
                this.placeShip(ship[0])
            },
            async placeShip(ship) {
                const {id, code} = this.$route.params;
                const objData = new FormData();
                objData.set('x', ship.x);
                objData.set('y', ship.y);
                objData.set('ship', ship.ship);
                objData.set('orientation', ship.orientation);

                const {data: {success}} = await this.$axios({
                    method: 'post',
                    url: `${config.baseURL}/api/place-ship/${id}/${code}`,
                    data: objData,
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                if (success) {
                    await this.$store.dispatch('server/fetch', {id: id, code: code})
                }
            },
            removeShip(id) {
                this.$store.dispatch('removeShip', id)
            },
            isClosedCell(options) {
                const x = options.x;
                const y = options.y;
                const length = options.shipLength;
                let isClosed = false;

                if (this.orientation) {
                    for (let i = x - 1; i <= x + length; i++) {
                        for (let j = y - 1; j <= y + 1; j++) {
                            if ((i >= 0 && j >= 0) && (i <= 9 && j <= 9)) {
                                const close = this.$store.getters.hasClose({x: i, y: j});
                                if (close) {
                                    isClosed = close
                                }
                            }
                        }
                    }
                } else {
                    for (let i = x - 1; i <= x + 1; i++) {
                        for (let j = y - 1; j <= y + length; j++) {
                            if ((i >= 0 && j >= 0) && (i <= 9 && j <= 9)) {
                                const close = this.$store.getters.hasClose({x: i, y: j});
                                if (close) {
                                    isClosed = close
                                }
                            }
                        }
                    }
                }


                if (isClosed) {
                    alert('Пересечение с другим кораблём');
                    if (this.orientation) {
                        this.orientation = false;

                        this.setShipImg({x: x, y: y, id: options.id});
                        this.setShip({x: x, y: y, shipLength: length, id: options.id});
                        isClosed = false
                    }
                } else {
                    this.setShipImg({x: x, y: y, id: options.id});
                    this.setShip({x: x, y: y, shipLength: length, id: options.id});
                    isClosed = false;

                    if (length > 1) {
                        document.getElementById(`ship${options.id}`).addEventListener('click', this.rotateHandle)
                    }
                }
            },
            rotateHandle() {
                const shipId = this.shipCurrentId;
                this.orientation = !this.orientation;
                this.removeShip(shipId);

                if (this.orientation) {
                    if (this.shipLength === 2 && this.x > 8) {
                        this.isClosedCell({x: this.x - 1, y: this.y, shipLength: this.shipLength, id: shipId})
                    } else if (this.shipLength === 3 && this.x > 7) {
                        this.isClosedCell({x: this.x - 2, y: this.y, shipLength: this.shipLength, id: shipId})
                    } else if (this.shipLength === 4 && this.x > 6) {
                        this.isClosedCell({x: this.x - 3, y: this.y, shipLength: this.shipLength, id: shipId})
                    } else {
                        this.isClosedCell({x: this.x, y: this.y, shipLength: this.shipLength, id: shipId})
                    }
                } else {
                    if (this.shipLength === 2 && this.y > 8) {
                        this.removeShip(shipId);
                        this.isClosedCell({x: this.x, y: this.y - 1, shipLength: this.shipLength, id: shipId})
                    } else if (this.shipLength === 3 && this.y > 7) {
                        this.removeShip(shipId);
                        this.isClosedCell({x: this.x, y: this.y - 2, shipLength: this.shipLength, id: shipId})
                    } else if (this.shipLength === 4 && this.y > 6) {
                        this.removeShip(shipId);
                        this.isClosedCell({x: this.x, y: this.y - 3, shipLength: this.shipLength, id: shipId})
                    } else {
                        this.removeShip(shipId);
                        this.isClosedCell({x: this.x, y: this.y, shipLength: this.shipLength, id: shipId})
                    }
                }
            },
            enterCell({x, y}) {
                for (let i = x; i >= 0; i--) {
                    for (let j = y; j >= 0; j--) {
                        const row = document.getElementById(`enemy${i}${y}`);
                        const cell = document.getElementById(`enemy${x}${j}`);
                        row.classList.add('selected');
                        cell.classList.add('selected')
                    }
                }
            },
            outCell({x, y}) {
                for (let i = x; i >= 0; i--) {
                    for (let j = y; j >= 0; j--) {
                        const row = document.getElementById(`enemy${i}${y}`);
                        const cell = document.getElementById(`enemy${x}${j}`);
                        row.classList.remove('selected');
                        cell.classList.remove('selected')
                    }
                }
            },
            async shotHandle({x, y}) {
                const turn = this.$store.getters['server/isMyTurn']();

                if (turn) {
                    const {id, code} = this.$route.params;
                    const objData = new FormData();
                    objData.set('x', y);
                    objData.set('y', x);

                    const {data} = await this.$axios({
                        method: 'post',
                        url: `${config.baseURL}/api/shot/${id}/${code}`,
                        data: objData,
                        headers: {'Content-Type': 'multipart/form-data'}
                    });
                    if (data.hit && data.success) {
                        this.variableCellClass = 'shot'
                    } else if (!data.hit && data.success) {
                        this.variableCellClass = 'shot-miss'
                    } else if (!data.success) {
                        alert('Вы сюда уже стреляли!')
                    }
                } else {
                    alert('Притормози, ход противника!')
                }
            },

        },
    }
</script>

<style lang="less">
    .cell {
        width: 100%;
        border-left: 1px solid rgba(255, 255, 255, .46);

        &:first-child {
            border-left: 1px solid transparent;
        }
    }

    .drop {
        width: 100%;
        height: 45px;
        position: relative;
    }

    .battle-cell:hover,
    .battle-cell.selected {
        background: rgba(#fff, .2);
    }

    .battle-cell.selected.shot {
        background-color: rgba(#000, .5);
    }

    .shot {
        position: relative;
        background-color: #000;

        &:after {
            content: '';
            position: absolute;
            background-image: url(../../assets/img/shot.png);
            background-size: cover;
            width: 71px;
            height: 90px;
            top: -44px;
            left: -36px;
            transform: rotateZ(-45deg) rotateY(-54deg);
        }
    }

    .shot-miss {
        position: relative;

        &:after {
            content: '';
            position: absolute;
            width: 15px;
            height: 15px;
            background: #000;
            border-radius: 50%;
            top: 14px;
            left: 14px;
        }
    }

    .battle-cell:hover {
        position: relative;

        .select-cords {
            display: block;
        }

        &:before {
            position: absolute;
            content: '';
            background-image: url('../../assets/img/select.png');
            width: 130px;
            height: 72px;
            background-size: cover;
            top: -21px;
            left: -48px;
            transform: rotateZ(-44deg) rotateY(-60deg);
        }
    }

    .select-cords {
        display: none;
        position: absolute;
        background: #000;
        color: #fff;
        top: -33px;
        left: -78px;
        width: 130px;
        text-align: center;
        font-size: 25px;
        padding: 2px 5px;
        transform: rotateZ(-45deg) rotateY(-54deg);
        pointer-events: none;
    }


</style>