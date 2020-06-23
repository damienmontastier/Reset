export const state = () => ({
  posts: []
})

export const mutations = {
  setPosts(state, posts) {
    state.posts = posts
  }
}

export const getters = {}

export const actions = {
  async fetch({ commit }) {
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
    commit('setPosts', posts)
  }
}
