export const state = () => ({
  missionReportVisible: undefined,
  terminalVisible: undefined
})

export const mutations = {
  setTerminalVisible(state, value) {
    state.terminalVisible = value
  },
  setMissionReportVisible(state, value) {
    state.missionReportVisible = value
  }
}
