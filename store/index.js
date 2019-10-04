export const state = () => ({
    mode: 'settai',
    difficulty: '2'
})

export const mutations = {
    setGameConf(state, payload) {
        state.mode = payload.mode
        state.difficulty = payload.difficulty
    }
}