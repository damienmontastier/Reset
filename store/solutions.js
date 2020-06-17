export const state = () => ({
  list: [
    {
      id: '01',
      title: 'iOS Screen Time',
      required_score: 180,
      stage: 1,
      locked_wording: 'or less in STAGE 1',
      opened: false
    },
    {
      id: '02',
      title: 'Facebook Timer',
      required_score: 200,
      stage: 1,
      locked_wording: 'or less in STAGE 1',
      opened: false
    },
    {
      id: '03',
      title: 'Screen color',
      required_score: 220,
      stage: 1,
      locked_wording: 'or less in STAGE 1',
      opened: false
    },
    {
      id: '04',
      title: 'Android',
      required_score: 50,
      stage: 2,
      locked_wording: 'or more in STAGE 2',
      opened: false
    },
    {
      id: '05',
      title: 'iOS Screen Time',
      required_score: 180,
      stage: 2,
      locked_wording: 'or less in STAGE 2',
      opened: false
    },
    {
      id: '06',
      title: 'Teddd',
      required_score: 200,
      stage: 2,
      locked_wording: 'or less in STAGE 2',
      opened: true
    },
    {
      id: '07',
      title: 'Ipsum',
      required_score: 220,
      stage: 3,
      locked_wording: 'or less in STAGE 3',
      opened: false
    },
    {
      id: '08',
      title: 'Lremp',
      required_score: 50,
      stage: 3,
      locked_wording: 'or more in STAGE 3',
      opened: false
    },
    {
      id: '07',
      title: 'Stage3',
      required_score: 220,
      stage: 3,
      locked_wording: 'or less in STAGE 3',
      opened: false
    }
  ]
})

export const mutations = {
  setSolutionOpened(state, { solution, opened }) {
    state.list.find((a) => a.id === solution.id).opened = opened
  }
}
