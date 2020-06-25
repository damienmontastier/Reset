export const state = () => ({
  toLoad: 0,
  loaded: 0,
  visible: false
})

export const mutations = {
  incrementLoaded(state) {
    state.loaded++
  },
  setToLoad(state, value) {
    state.toLoad = value
  },
  setVisible(state, value) {
    state.visible = value
  }
}

export const getters = {
  progress: (state) => {
    return state.loaded / state.toLoad
  }
}