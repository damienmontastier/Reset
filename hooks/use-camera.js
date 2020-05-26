import * as THREE from 'three'
import viewport from '@/plugins/viewport'

let camera

class Camera {
  constructor() {
    // camera
    // this.camera = new THREE.OrthographicCamera(
    //   viewport.width / -2,
    //   viewport.width / 2,
    //   viewport.height / 2,
    //   viewport.height / -2,
    //   -10000,
    //   10000
    // )

    this.camera = new THREE.PerspectiveCamera(
      40,
      viewport.width / viewport.height,
      1,
      1000
    )

    // this.originPosition = new THREE.Vector3(1.1, 6.6, 6).normalize()
    // this.distance = 10

    // events
    this.onWindowResizeHandler = this.onWindowResize.bind(this)
    viewport.events.on('resize', this.onWindowResizeHandler)
  }

  onWindowResize() {
    if (this.camera.type === 'PerspectiveCamera') {
      this.camera.aspect = viewport.width / viewport.height
    } else if (this.camera.type === 'OrthographicCamera') {
      this.camera.left = viewport.width / -2
      this.camera.right = viewport.width / 2
      this.camera.top = viewport.height / 2
      this.camera.bottom = viewport.height / -2
      this.camera.updateProjectionMatrix()
    }

    this.camera.updateProjectionMatrix()
  }

  destroy() {
    viewport.events.off('resize', this.onWindowResizeHandler)
  }
}

const useCamera = () => {
  return camera || (camera = new Camera())
}

export default useCamera
