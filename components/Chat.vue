<template>
    <div class="wrapper">
        <div class="messages-wrapper">
            <div class="messages-inner">
                <p v-for="message in messages">
                    <span v-if="message.my">Вы: </span>
                    <span v-else>Противник: </span>
                    {{message.message}}</p>
            </div>
        </div>
        <div class="controls">
            <input type="text" placeholder="Написать в чат" v-model="message">
            <button type="submit" @click="sendMessage">Отправить</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                messages: [],
                lastTime: false,
                message: ''
            }
        },
        mounted() {
            this.getMessage()
        },
        methods: {
            async getMessage() {
                const {id, code} = this.$route.params;
                const {lastTime, messages, success} = await this.$axios.$get(`http://battleships.dev.sibirix.ru/api/chat-load/${id}/${code}?lastTime=${this.lastTime}`);

                this.messages = messages;
                this.lastTime = lastTime;

                if (success) {
                    setInterval(() => {
                        this.getIntervalMessage()
                    }, 5000)
                }
            },
            async getIntervalMessage() {
                const {id, code} = this.$route.params;
                const {lastTime, messages, success} = await this.$axios.$get(`http://battleships.dev.sibirix.ru/api/chat-load/${id}/${code}?lastTime=${this.lastTime}`);

                if (messages.length > 0) {
                    for (let mess of messages) {
                        this.messages.unshift(mess)
                    }
                }
                this.lastTime = lastTime
            },
            async sendMessage() {
                if (this.message.replace(/\s/g, '').length > 0) {
                    const {id, code} = this.$route.params;
                    const str = new FormData();

                    str.set('message', this.message);
                    this.message = '';

                    const response = await this.$axios({
                        method: 'post',
                        url: `http://battleships.dev.sibirix.ru/api/chat-send/${id}/${code}`,
                        data: str,
                        headers: {'Content-Type': 'multipart/form-data'}
                    })

                } else {
                    alert('Введите сообщение!')
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    .wrapper {
        width: 100%;
        margin-top: 60px;
        color: #fff;

        .messages-wrapper {
            padding: 10px 10px 10px 20px;
            border: 1px solid #38383b;
            max-height: 144px;
            transform: translateZ(10px);
        }

        .messages-inner {
            padding: 10px 0;
            height: 124px;
            overflow-y: auto;

            &::-webkit-scrollbar {
                width: 4px;
                margin-right: 10px;
            }
            &::-webkit-scrollbar-button {
                display: none;
            }
            &::-webkit-scrollbar-track {
                background-color: #343435;
            }

            &::-webkit-scrollbar-thumb {
                height: 50px;
                background-color: #fff;
            }

            p {
                margin-bottom: 30px;

                &:last-child {
                    margin-bottom: 0;
                }
            }

            span {
                color: #3399cc;
            }
        }

        .controls {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;

            input {
                background: transparent;
                max-width: 1015px;
                width: 100%;
                border: 1px solid #38383b;
                padding: 0 20px;
                color: #fff;
                height: 44px;

                &::placeholder {
                    font-size: 14px;
                    color: #808080;
                }
            }

            button {
                text-transform: uppercase;
                font-size: 14px;
                font-weight: 700;
                color: #000;
                height: 44px;
                padding: 0 30px;
                margin-left: 10px;
                background-color: #ffcc00;
                border: none;
                cursor: pointer;
                outline: none;
                box-shadow: 0 0 0 #ffcc00, 0 0 0 #ffcc00;
                transition: all .3s;
                z-index: 150;

                &:hover {
                    box-shadow: 0 -3px 0 #ffcc00, 0 3px 0 #ffcc00;
                }
            }
        }
    }
</style>