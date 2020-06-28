import events from '@/plugins/events'
import GLOBAL_CONFIG from '@/config/global'

let GUI

const useGUI = () => {
  if (!GUI) {
    const dat = require('dat.gui')
    const init = require('three-dat.gui')
    init(dat)

    GUI = new dat.GUI()
    // GUI.closed = true

    // camera
    GUI.camera = GUI.addFolder('Camera')

    // rendering
    GUI.rendering = GUI.addFolder('Rendering')

    // audio
    GUI.audio = GUI.addFolder('Audio')

    // postprocessing
    GUI.postprocessing = GUI.rendering.addFolder('Post-processing')

    if (GLOBAL_CONFIG.GUI) {
      GUI.show()
    } else {
      GUI.hide()
    }

    events.on('TOGGLE_GUI', (value) => {
      if (value) {
        GUI.show()
      } else {
        GUI.hide()
      }
    })
  }

  return GUI
}

export default useGUI
