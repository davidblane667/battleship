<template>
    <div class="content">
        <a @click.prevent="setStartData" href="#" class="btn">— Для начала, расставь корабли, каналья!</a>
        <div class="content-left">
            <Ship :shipLength="4" :shipNumber="1"/>

            <Ship :shipLength="3" :shipNumber="1"/>
            <Ship :shipLength="3" :shipNumber="2"/>

            <Ship :shipLength="2" :shipNumber="1"/>
            <Ship :shipLength="2" :shipNumber="2"/>
            <Ship :shipLength="2" :shipNumber="3"/>

            <Ship :shipLength="1" :shipNumber="1"/>
            <Ship :shipLength="1" :shipNumber="2"/>
            <Ship :shipLength="1" :shipNumber="3"/>
            <Ship :shipLength="1" :shipNumber="4"/>
        </div>
        <div class="content-right">
            <Battleground/>
        </div>
    </div>
</template>

<script>
    import Ship from '@/components/Ship'
    import Battleground from '@/components/battleground/Battleground'

    export default {
        components: {
            Ship,
            Battleground
        },
        methods: {
            async setStartData() {
                await this.$store.dispatch('server/gameStart');

                const game = this.$store.state.server.game;

                const id = game.id;
                const code = game.code;

                this.$router.push(`/prepare/${id}/${code}`)
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
        text-decoration: none;
        position: absolute;
        top: 300px;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
        z-index: 100;
        font-weight: 700;
        font-size: 24px;
        line-height: 22px;
        color: #000;
        padding: 20px;
        background: #ffcc00;
        border: none;
        box-shadow: 0 0 0 #ffcc00, 0 0 0 #ffcc00;
        transition: all .3s;

        &:hover {
            box-shadow: 0 -3px 0 #ffcc00, 0 3px 0 #ffcc00;
        }
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
</style>
