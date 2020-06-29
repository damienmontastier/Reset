import events from '@/plugins/events'
import GLOBAL_CONFIG from '@/config/global'

let GUI

const useGUI = () => {
  if (!GUI) {
    const dat = require('dat.gui')
    const init = require('three-dat.gui')
    init(dat)

    dat.GUI.prototype._addFolder = function(name) {
      if (this.__folders[name]) {
        return this.__folders[name]
      } else {
        return this.addFolder(name)
      }
    }

    GUI = new dat.GUI()
    // GUI.closed = true

    // camera
    GUI.camera = GUI._addFolder('Camera')

    // rendering
    GUI.rendering = GUI._addFolder('Rendering')

    // audio
    GUI.audio = GUI._addFolder('Audio')

    // postprocessing
    GUI.postprocessing = GUI.rendering._addFolder('Post-processing')

    console.log(GUI)

    GUI.toggle = (value) => {
      if (value) {
        GUI.show()
      } else {
        GUI.hide()
      }
    }

    GUI.toggle(GLOBAL_CONFIG.GUI)

    events.on('TOGGLE_GUI', GUI.toggle)
  }

  return GUI
}

export default useGUI
