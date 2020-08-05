<template>
    <div class="header-menu">
        <a href="/" class="logo"></a>
        <div class="invite-block" v-if="$route.path.indexOf('prepare') !== -1">
            <span>Пригласить к битве</span>
            <button @click="copyLink"></button>
            <span class="link">{{getInviteLink()}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                inviteLink: ''
            }
        },
        methods: {
            getInviteLink() {
                const {game} = this.$store.state.server.game;

                const id = game.id;
                const invite = game.invite;
                return this.inviteLink = `http://localhost:3000/prepare/${id}/${invite}`
            },
            copyLink() {
                navigator.clipboard.writeText(this.inviteLink)
            }
        }
    }
</script>

<style lang="less" scoped>
    .header-menu {
        padding-top: 30px;
        display: flex;
        justify-content: space-between;
    }

    .logo {
        width: 188px;
        height: 44px;
        background: url('../assets/img/logo.png') no-repeat;
    }

    .invite-block {
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 15px;
        cursor: default;

        span {
            margin-right: 15px;
        }

        button {
            width: 29px;
            height: 29px;
            border: none;
            background: transparent url('../assets/img/copy-link.png');
            cursor: pointer;
            transition: all .3s;
            opacity: 1;
            outline: none;

            &:hover {
                opacity: .5;
            }
        }

        .link {
            color: #0099cc;
            margin-left: 20px;
            border-bottom: 1px dashed #0099cc;
        }
    }
</style>