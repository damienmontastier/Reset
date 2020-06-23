export const strict = false

export const state = () => ({
  levels: [],
  terminalOpened: false,
  overlayOpened: false,
  appearHeader: false
})

export const mutations = {
  setLevelsContent(state, levels) {
    state.levels = levels
  },

  setTerminalOpened(state, value) {
    state.terminalOpened = value
    this.commit('setOverlayOpened', value)
  },

  setOverlayOpened(state, value) {
    state.overlayOpened = value
  },

  setHeader(state, value) {
    state.appearHeader = value
  }
}

export const getters = {}

export const actions = {
  async nuxtServerInit({ commit, dispatch }) {
    const levelsFiles = await require.context(
      '~/assets/content/levels',
      false,
      /\.json$/
    )
    const levels = levelsFiles.keys().map((key) => {
      const res = levelsFiles(key)
      res.slug = key.slice(2, -5)
      return res
    })
    await commit('setLevelsContent', levels)

    await dispatch('notifications/fetch')
    await dispatch('stages/fetch')
    await dispatch('solutions/fetch')
  }
}
