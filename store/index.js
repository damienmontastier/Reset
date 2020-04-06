export const strict = false

export const state = () => ({})

export const mutations = {}

export const getters = {}

export const actions = {
  async nuxtServerInit({ commit }) {
    const files = await require.context('~/assets/content/', false, /\.json$/)
    const blogPosts = files.keys().map((key) => {
      const res = files(key)
      res.slug = key.slice(2, -5)
      return res
    })
    console.log(blogPosts)
    await commit('setBlogPosts', blogPosts)
  }
}
