export const state = () => ({
  list: {},
  opened: false
})

export const mutations = {
  setSolutionOpened(state, { solution, opened }) {
    Object.values(state.list).find(
      (a) => a.slug === solution.slug
    ).opened = opened
  },
  setList(state, list) {
    state.list = list
  },
  toggleOpened(state) {
    state.opened = !state.opened
  },
  setOpened(state, value) {
    state.opened = value
  }
}

export const actions = {
  async fetch({ commit, rootState }) {
    const files = await require.context(
      '~/assets/content/solutions/',
      false,
      /\.json$/
    )
    const list = {}
    files.keys().forEach((key) => {
      const res = files(key)
      res.slug = key.slice(2, -5)
      res.opened = false
      // res.stage = {}
      // res.stage = rootState.stages.list[res.stage]

      list[res.slug] = res
    })

    commit('setList', list)
  }
}
