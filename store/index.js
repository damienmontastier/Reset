export const strict = false

export const state = () => ({
  levels: [],
  posts: [],
  terminalOpened: false,
  overlayOpened: false
})

export const mutations = {
  setLevelsContent(state, levels) {
    state.levels = levels
  },

  setPosts(state, posts) {
    state.posts = posts
  },

  setTerminalOpened(state, value) {
    state.terminalOpened = value
    this.commit('setOverlayOpened', value)
  },

  setOverlayOpened(state, value) {
    state.overlayOpened = value
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

    const postsFiles = await require.context(
      '~/assets/content/posts',
      false,
      /\.json$/
    )
    const posts = postsFiles.keys().map((key) => {
      const res = postsFiles(key)
      res.slug = key.slice(2, -5)
      return res
    })
    await commit('setPosts', posts)

    await dispatch('stages/fetch')
    await dispatch('solutions/fetch')
  }
}
