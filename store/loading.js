export const state = () => ({
  toLoad: 0,
  loaded: 0
})

export const mutations = {
  incrementLoaded(state) {
    state.loaded++
    console.log('incremented')
  },
  setToLoad(state, value) {
    console.log('toload', value)
    state.toLoad = value
  }
}

export const getters = {
  progress: (state) => {
    return state.loaded / state.toLoad
  }
}
