export const state = () => ({
  list: []
})

export const mutations = {
  setSolutionOpened(state, { solution, opened }) {
    state.list.find((a) => a.id === solution.id).opened = opened
  },
  setList(state, list) {
    state.list = list
  }
}

export const actions = {
  async fetch({ commit }) {
    const files = await require.context(
      '~/assets/content/levels/',
      false,
      /\.json$/
    )
    const list = {}
    files.keys().forEach((key) => {
      const res = files(key)
      res.slug = key.slice(2, -5)
      list[res.slug] = res
    })

    commit('setList', list)
  }
}
