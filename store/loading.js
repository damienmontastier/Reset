export const state = () => ({
  commands: [],
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
  },
  setCommands(state, value) {
    state.commands = value
  },
  setInitialState(state) {
    state.commands = []
    state.toLoad = 0
    state.loaded = 0
    state.visible = false
  }
}

export const getters = {
  progress: (state) => {
    return state.loaded / state.toLoad
  }
}
