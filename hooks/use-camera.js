import * as THREE from 'three'
import viewport from '@/plugins/viewport'

let camera

class Camera {
  constructor() {
    // camera
    this.camera = new THREE.OrthographicCamera(
      viewport.width / -2,
      viewport.width / 2,
      viewport.height / 2,
      viewport.height / -2,
      -10000,
      10000
    )

    // events
    viewport.events.on('resize', this.onWindowResize.bind(this))
  }

  onWindowResize() {
    this.camera.left = viewport.width / -2
    this.camera.right = viewport.width / 2
    this.camera.top = viewport.height / 2
    this.camera.bottom = viewport.height / -2
    this.camera.updateProjectionMatrix()
  }

  destroy() {}
}

const useCamera = () => {
  return camera || (camera = new Camera())
}

export default useCamera
