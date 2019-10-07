export const state = () => ({
    mode: 'settai',
    difficulty: '2',
    adv: false,
    W: null,
    w: null,
})

export const mutations = {
    setGameConf(state, payload) {
        state.mode = payload.mode
        state.difficulty = payload.difficulty
    },
    setAdvGameConf(state, payload) {
        state.mode = payload.mode
        state.difficulty = payload.difficulty
        state.adv = true
        state.W = payload.W
        state.w = payload.w
    }
}