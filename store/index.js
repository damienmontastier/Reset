export const strict = false

export const state = () => ({
  levels: []
})

export const mutations = {
  setLevelsContent(state, levels) {
    state.levels = levels
  }
}

export const getters = {}

export const actions = {
  async nuxtServerInit({ commit }) {
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
  }
}
