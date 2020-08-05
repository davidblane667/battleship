<template>
    <div class="content">
        <div class="content-left">
            <Ship :shipLength="4" :shipNumber="1" :key="`ship4-${shipKey}`"/>
            <div class="ship ship4"></div>

            <Ship :shipLength="3" :shipNumber="1" :key="`ship31-${shipKey}`"/>
            <Ship :shipLength="3" :shipNumber="2" :key="`ship32-${shipKey}`"/>
            <div class="ship ship3"></div>
            <div class="ship ship3 ship32"></div>

            <Ship :shipLength="2" :shipNumber="1" :key="`ship21-${shipKey}`"/>
            <Ship :shipLength="2" :shipNumber="2" :key="`ship22-${shipKey}`"/>
            <Ship :shipLength="2" :shipNumber="3" :key="`ship23-${shipKey}`"/>
            <div class="ship ship2"></div>
            <div class="ship ship2 ship22"></div>
            <div class="ship ship2 ship23"></div>

            <Ship :shipLength="1" :shipNumber="1" :key="`ship11-${shipKey}`"/>
            <Ship :shipLength="1" :shipNumber="2" :key="`ship12-${shipKey}`"/>
            <Ship :shipLength="1" :shipNumber="3" :key="`ship13-${shipKey}`"/>
            <Ship :shipLength="1" :shipNumber="4" :key="`ship14-${shipKey}`"/>
            <div class="ship ship1"></div>
            <div class="ship ship1 ship12"></div>
            <div class="ship ship1 ship13"></div>
            <div class="ship ship1 ship14"></div>
        </div>
        <div class="content-right">
            <Battleground/>
        </div>
        <button @click="setStatusReady" :disabled="isFullField" class="btn btn-ready">— Все готово, адмирал! Начать
            игру!
        </button>
        <button disabled class="btn btn-wait">— Ждём готовности противника!</button>
        <div class="interface">
            <div class="interface-item move">
                <span>Мышью перетаскивай корабли на поле</span>
            </div>
            <div class="interface-item rotate">
                <span>Кликай для поворота корабля</span>
            </div>
            <div class="interface-item random">
                <span @click="setRandomShips">Расставить в случайном порядке</span>
            </div>
            <div class="interface-item crashed">
                <span @click="restartData">С глаз долой!</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Ship from '@/components/Ship'
    import Battleground from '@/components/battleground/Battleground'
    import axios from 'axios'


    export default {
        async fetch({store, params}) {
            await store.dispatch('server/fetch', {id: params.id, code: params.code});
        },
        components: {
            Ship,
            Battleground,
        },
        data() {
            return {
                shipKey: 0,
                shipX: null,
                shipY: null,
                shipLength: null,
                shipId: null,
                shipOrientation: true,
                isFullField: true,
                localData: [],
                isReady: false,
                lock: false
            }
        },
        mounted() {
            setInterval(() => {
                this.isFullField = this.$store.getters['server/isFullPlaces']
            }, 2000);
            this.localData = this.$store.getters['server/expandAllData']();
            setTimeout(() => {
                this.setShipsFromServer(this.localData)
            }, 0);
            this.setStatusReady()
        },
        methods: {
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
            restartData() {
                this.$store.dispatch('restartData');
                this.shipKey += 1;

                this.clearField()
            },
            setRandomShips() {
                this.clearField();

                this.shipX = Math.floor(Math.random() * 10);
                this.shipY = Math.floor(Math.random() * 10);

                for (let i = 1; i <= 4; i++) {
                    this.shipLength = 1;
                    this.shipId = 'ship' + this.shipLength + '-' + i;
                    this.handleDrop({x: this.shipX, y: this.shipY, shipLength: this.shipLength, id: this.shipId})
                }
                for (let i = 1; i <= 3; i++) {
                    this.shipLength = 2;
                    this.shipId = 'ship' + this.shipLength + '-' + i;
                    this.handleDrop({x: this.shipX, y: this.shipY, shipLength: this.shipLength, id: this.shipId})
                }
                for (let i = 1; i <= 2; i++) {
                    this.shipLength = 3;
                    this.shipId = 'ship' + this.shipLength + '-' + i;
                    this.handleDrop({x: this.shipX, y: this.shipY, shipLength: this.shipLength, id: this.shipId})
                }
                for (let i = 1; i <= 1; i++) {
                    this.shipLength = 4;
                    this.shipId = 'ship' + this.shipLength + '-' + i;
                    this.handleDrop({x: this.shipX, y: this.shipY, shipLength: this.shipLength, id: this.shipId})
                }

                const shipsData = this.$store.getters.compilationAllData();
                this.placeShip(shipsData)
            },
            async placeShip(ship) {
                const {id, code} = this.$route.params;
                const str = new FormData();
                for (let i = 0; i < ship.length; i++) {
                    str.set(`ships[${i}][ship]`, ship[i].ship.slice(4));
                    str.set(`ships[${i}][x]`, ship[i].x);
                    str.set(`ships[${i}][y]`, ship[i].y);
                    str.set(`ships[${i}][orientation]`, ship[i].orientation)
                }

                const {data: {success}} = await this.$axios({
                    method: 'post',
                    url: `http://battleships.dev.sibirix.ru/api/place-ship/${id}/${code}`,
                    data: str,
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                if (success) {
                    await this.$store.dispatch('server/fetch', {id: id, code: code});
                    this.isFullField = this.$store.getters['server/isFullPlaces']
                }
            },
            async clearField() {
                const {id, code} = this.$route.params;

                const {success} = await this.$axios.$post(`http://battleships.dev.sibirix.ru/api/clear-field/${id}/${code}`);
                if (success) {
                    await this.$store.dispatch('server/fetch', {id: id, code: code})
                }
            },
            handleDrop(data) {
                this.shipLength = data.shipLength;
                this.shipOrientation = Math.random() >= 0.5;

                if (this.shipOrientation) {
                    if (data.shipLength === 2 && data.x > 8) {
                        this.removeShip(data.id);
                        this.isClosedCellVertical({x: data.x - 1, y: data.y, shipLength: data.shipLength, id: data.id})
                    } else if (data.shipLength === 3 && data.x > 7) {
                        this.removeShip(data.id);
                        this.isClosedCellVertical({x: data.x - 2, y: data.y, shipLength: data.shipLength, id: data.id})
                    } else if (data.shipLength === 4 && data.x > 6) {
                        this.removeShip(data.id);
                        this.isClosedCellVertical({x: data.x - 3, y: data.y, shipLength: data.shipLength, id: data.id})
                    } else {
                        this.removeShip(data.id);
                        this.isClosedCellVertical({x: data.x, y: data.y, shipLength: data.shipLength, id: data.id})
                    }
                } else if (data.shipLength === 2 && data.y > 8) {
                    this.removeShip(data.id);
                    this.isClosedCell({x: data.x, y: data.y - 1, shipLength: data.shipLength, id: data.id})
                } else if (data.shipLength === 3 && data.y > 7) {
                    this.removeShip(data.id);
                    this.isClosedCell({x: data.x, y: data.y - 2, shipLength: data.shipLength, id: data.id})
                } else if (data.shipLength === 4 && data.y > 6) {
                    this.removeShip(data.id);
                    this.isClosedCell({x: data.x, y: data.y - 3, shipLength: data.shipLength, id: data.id})
                } else {
                    this.removeShip(data.id);
                    this.isClosedCell({x: data.x, y: data.y, shipLength: data.shipLength, id: data.id})
                }
            },
            setShipImgFromServer(options) {
                const cordX = document.getElementById(`${options.x}${options.y}`).getBoundingClientRect().left;
                const cordY = document.getElementById(`${options.x}${options.y}`).getBoundingClientRect().top;

                const shipElem = document.getElementById(`${options.id}`);

                if (options.shipOrientation === 'vertical') {
                    shipElem.style.transform = 'rotateZ(180deg) rotateX(180deg)';

                    if (options.id === 'ship4-1') {
                        shipElem.style.top = cordY - 30 + 'px';
                        shipElem.style.left = cordX - 450 + 'px'
                    } else if (options.shipLength === 3) {
                        shipElem.style.top = cordY - 6 + 'px';
                        shipElem.style.left = cordX - 410 + 'px'
                    } else if (options.shipLength === 2) {
                        shipElem.style.top = cordY - 5 + 'px';
                        shipElem.style.left = cordX - 380 + 'px'
                    } else {
                        shipElem.style.transform = '';
                        shipElem.style.top = cordY + 'px';
                        shipElem.style.left = cordX - 350 + 'px'
                    }

                } else {
                    shipElem.style.transform = '';

                    if (options.id === 'ship4-1') {
                        shipElem.style.top = cordY - 30 + 'px'
                    } else if (options.shipLength === 3) {
                        shipElem.style.top = cordY - 6 + 'px';
                        shipElem.style.left = cordX - 400 + 'px'
                    } else if (options.shipLength === 2) {
                        shipElem.style.top = cordY - 4 + 'px';
                        shipElem.style.left = cordX - 350 + 'px'
                    } else {
                        shipElem.style.top = cordY + 'px'
                    }
                    shipElem.style.left = cordX - 350 + 'px'

                }
            },
            setShipImg(options) {
                const cordX = document.getElementById(`${options.x}${options.y}`).getBoundingClientRect().left;
                const cordY = document.getElementById(`${options.x}${options.y}`).getBoundingClientRect().top;

                const shipElem = document.getElementById(`${options.id}`);

                if (this.shipOrientation) {
                    shipElem.style.transform = 'rotateZ(180deg) rotateX(180deg)';

                    if (options.id === 'ship4-1') {
                        shipElem.style.top = cordY - 30 + 'px';
                        shipElem.style.left = cordX - 450 + 'px'
                    } else if (this.shipLength === 3) {
                        shipElem.style.top = cordY - 6 + 'px';
                        shipElem.style.left = cordX - 410 + 'px'
                    } else if (this.shipLength === 2) {
                        shipElem.style.top = cordY - 5 + 'px';
                        shipElem.style.left = cordX - 380 + 'px'
                    } else {
                        shipElem.style.transform = '';
                        shipElem.style.top = cordY + 'px';
                        shipElem.style.left = cordX - 350 + 'px'
                    }

                } else {
                    shipElem.style.transform = '';

                    if (options.id === 'ship4-1') {
                        shipElem.style.top = cordY - 30 + 'px'
                    } else if (this.shipLength === 3) {
                        shipElem.style.top = cordY - 6 + 'px';
                        shipElem.style.left = cordX - 400 + 'px'
                    } else if (this.shipLength === 2) {
                        shipElem.style.top = cordY - 4 + 'px';
                        shipElem.style.left = cordX - 350 + 'px'
                    } else {
                        shipElem.style.top = cordY + 'px'
                    }
                    shipElem.style.left = cordX - 350 + 'px'

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
            removeShip(id) {
                this.$store.dispatch('removeShip', id)
            },
            isClosedCell(options) {
                let x = options.x;
                let y = options.y;
                const length = options.shipLength;
                let isClosed = false;


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

                if (isClosed) {
                    x = Math.floor(Math.random() * 10);
                    y = Math.floor(Math.random() * 10);

                    if (options.shipLength === 2 && y > 8) {
                        this.removeShip(options.id);
                        this.isClosedCell({x: x, y: y - 1, shipLength: length, id: options.id})
                    } else if (options.shipLength === 3 && y > 7) {
                        this.removeShip(options.id);
                        this.isClosedCell({x: x, y: y - 2, shipLength: length, id: options.id})
                    } else if (options.shipLength === 4 && y > 6) {
                        this.removeShip(options.id);
                        this.isClosedCell({x: x, y: y - 3, shipLength: length, id: options.id})
                    } else {
                        this.removeShip(options.id);
                        this.isClosedCell({x: x, y: y, shipLength: length, id: options.id})
                    }
                    isClosed = false
                } else {
                    this.setShipImg({x: x, y: y, id: options.id});
                    this.setShip({x: x, y: y, shipLength: length, id: options.id});
                    isClosed = false;
                }
            },
            isClosedCellVertical(options) {
                let x = options.x;
                let y = options.y;
                const length = options.shipLength;
                let isClosed = false;

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

                if (isClosed) {
                    x = Math.floor(Math.random() * 10);
                    y = Math.floor(Math.random() * 10);

                    if (options.shipLength === 2 && x > 8) {
                        this.removeShip(options.id);
                        this.isClosedCellVertical({x: x - 1, y: y, shipLength: options.shipLength, id: options.id})
                    } else if (options.shipLength === 3 && x > 7) {
                        this.removeShip(options.id);
                        this.isClosedCellVertical({x: x - 2, y: y, shipLength: options.shipLength, id: options.id})
                    } else if (options.shipLength === 4 && x > 6) {
                        this.removeShip(options.id);
                        this.isClosedCellVertical({x: x - 3, y: y, shipLength: options.shipLength, id: options.id})
                    } else {
                        this.removeShip(options.id);
                        this.isClosedCellVertical({x: x, y: y, shipLength: options.shipLength, id: options.id})
                    }
                    isClosed = false
                } else {
                    this.setShipImg({x: x, y: y, id: options.id});
                    this.setShipVertical({x: x, y: y, shipLength: length, id: options.id});
                    isClosed = false;
                }
            },
            async setStatusReady() {
                const {id, code} = this.$route.params;
                const response = await this.$axios.$post(`http://battleships.dev.sibirix.ru/api/ready/${id}/${code}`);

                if (response.enemyReady && response.success) {

                    this.$router.push(`/battle/${id}/${code}`)

                } else if (response.success) {
                    document.querySelector('.btn-ready').style.display = 'none';
                    document.querySelector('.btn-wait').style.display = 'block';

                    setInterval(() => {
                        this.$axios.$get(`http://battleships.dev.sibirix.ru/api/status/${id}/${code}`)
                            .then(data => {
                                if (data.game.status === '2') {
                                    this.$router.push(`/battle/${id}/${code}`)
                                }
                            })
                    }, 5000)
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .content {
        padding-top: 80px;
        display: flex;
        justify-content: flex-start;
    }

    .btn {
        position: absolute;
        top: 530px;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
        z-index: 100;
        font-weight: 700;
        font-size: 24px;
        line-height: 22px;
        color: #000;
        padding: 20px;
        text-decoration: none;
        background: #ffcc00;
        border: none;
        box-shadow: 0 0 0 #ffcc00, 0 0 0 #ffcc00;
        transition: all .3s;

        &:hover {
            box-shadow: 0 -3px 0 #ffcc00, 0 3px 0 #ffcc00;
        }

        &:disabled {
            &:hover {
                box-shadow: 0 0 0 #ffcc00, 0 0 0 #ffcc00;
            }
            cursor: default;
            opacity: .5;
            background: #999;
        }
    }

    .btn-wait {
        display: none;
    }

    .content-left {
        max-width: 220px;
        width: 100%;

        .row {
            display: flex;
            justify-content: flex-start;
            margin-top: 50px;
        }
    }

    .content-right {
        width: 100%;
        padding-left: 85px;
    }

    .interface {
        position: absolute;
        bottom: 30px;
        left: 0;
        display: flex;
        justify-content: space-between;
        max-width: 1197px;
        width: 100%;
        z-index: 1;
        transform: translateZ(110px);

        &-item {
            padding-left: 55px;
            margin-right: 30px;
            position: relative;
            color: #fff;

            &:before {
                position: absolute;
                content: '';
                top: 0;
                left: 0;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .move:before {
        background-image: url('../../../assets/img/move.png');
        width: 28px;
        height: 28px;
    }

    .rotate:before {
        background-image: url('../../../assets/img/rotate.png');
        width: 25px;
        height: 26px;
    }

    .random {
        span {
            border-bottom: 1px dashed #fff;
            transition: all .3s;
            cursor: pointer;

            &:hover {
                border-bottom: none;
            }
        }

        &:before {
            background-image: url('../../../assets/img/random.png');
            width: 29px;
            height: 27px;
        }
    }

    .crashed {
        span {
            border-bottom: 1px dashed #fff;
            transition: all .3s;
            cursor: pointer;

            &:hover {
                border-bottom: none;
            }
        }

        &:before {
            background-image: url('../../../assets/img/crashed.png');
            width: 21px;
            height: 26px;
        }
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

    .ship {
        position: absolute;
        z-index: 1;
        opacity: .5;
    }

    .ship32 {
        left: 120px;
    }

    .ship22 {
        left: 100px;
    }

    .ship23 {
        left: 200px;
    }

    .ship12 {
        left: 60px;
    }

    .ship13 {
        left: 120px;
    }

    .ship14 {
        left: 180px;
    }
</style>
