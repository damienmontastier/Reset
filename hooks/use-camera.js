// import { TweenLite } from 'gsap'
// import { RoughEase, Linear } from 'gsap'

import gsap from 'gsap'
import viewport from '@/plugins/viewport'

let camera

class Camera extends THREE.Object3D {
  constructor() {
    super()
    gsap.registerPlugin(CustomEase)
    gsap.registerPlugin(CustomWiggle)

    this.camera = new THREE.PerspectiveCamera(
      40,
      viewport.width / viewport.height,
      1,
      1000
    )

    this.add(this.camera)

    // events
    this.onWindowResizeHandler = this.onWindowResize.bind(this)
    viewport.events.on('resize', this.onWindowResizeHandler)
  }

  shake() {
    CustomWiggle.create('myWiggle', { wiggles: 12, type: 'easeOut' })

    gsap.to(this.camera.position, {
      duration: 0.8,
      x: 1,
      ease: 'myWiggle'
    })
  }

  onWindowResize() {
    this.camera.aspect = viewport.width / viewport.height

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
