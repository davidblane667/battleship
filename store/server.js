import config from '../nuxt.config.js'

export const state = () => ({
    game: {}
});

export const mutations = {
    setData(state, data) {
        state.game = data
    }
};

export const actions = {
    async gameStart({commit}) {
        const gameData = await this.$axios.$post(`${config.baseURL}/api/start/`);
        commit('setData', gameData)
    },
    async fetch({commit}, options) {
        const data = await this.$axios.$get(`${config.baseURL}/api/status/${options.id}/${options.code}`);
        commit('setData', data)
    },
};

export const getters = {
    game: s => s.game,
    isFullPlaces: state => {
        let isFull = true;
        if (state.game.usedPlaces && state.game.usedPlaces.length === 10) {
            isFull = false
        }
        return isFull
    },
    expandAllData: state => () => {
        const localData = [];
        const sData = state.game.fieldMy;

        for (let i = 0; i < sData.length; i++) {
            for (let j = 0; j < sData[i].length; j++) {
                const length = sData[i][j][0].slice(0, 1);
                let closed = false;

                localData.forEach(el => {
                    if (el.shipId === sData[i][j][0]) {
                        if (el.x === i) {
                            el.orientation = 'vertical'
                        } else el.orientation = 'horizontal';
                        closed = true;
                    }
                });

                if (sData[i][j][0] !== 'empty' && !closed) {
                    localData.push({x: i, y: j, shipId: sData[i][j][0], length: length, orientation: 'vertical'})
                }
            }
        }

        return localData
    },
    isMyTurn: state => () => {
        return state.game.game.myTurn
    },
    getDestroyedShipsMy: state => () => {
        return state.game.fieldMy
    },
    getDestroyedShipsEnemy: state => () => {
        return state.game.fieldEnemy
    },
    getStatusGame: state => () => {
        return state.game.game.status
    }
};
