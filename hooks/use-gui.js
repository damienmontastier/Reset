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
    GUI.camera.closed = false

    // rendering
    GUI.rendering = GUI.addFolder('Rendering')

    // audio
    GUI.audio = GUI.addFolder('Audio')

    // postprocessing
    GUI.postprocessing = GUI.rendering.addFolder('Post-processing')
  }

  return GUI
}

export default useGUI
