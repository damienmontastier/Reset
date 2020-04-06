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
    const files = await require.context(
      '~/assets/content/levels',
      false,
      /\.json$/
    )
    const blogPosts = files.keys().map((key) => {
      const res = files(key)
      res.slug = key.slice(2, -5)
      return res
    })
    console.log(blogPosts)
    // await commit('setBlogPosts', blogPosts)
  }
}
