import * as THREE from 'three'
import gsap from 'gsap'
import Spline from '@/webgl/utils/spline'
import Raf from '@/plugins/raf'

export default class Workers extends THREE.Object3D {
  constructor({ model }) {
    super()

    this.model = model.getObjectByName('model')
    this.spline = model.getObjectByName('spline')
    this.time = 0

    this.add(this.model)
    this.model.scale.multiplyScalar(10)

    this.init()

    Raf.add(this.model.uuid, this.render.bind(this), 0)

    document.addEventListener('mousedown', () => {
      this.spline.start()
    })

    document.addEventListener('mouseup', () => {
      this.spline.stop()
    })
  }
  init() {
    this.spline = new Spline({
      spline: this.spline,
      loop: false,
      autoplay: true
    })

    this.path = this.spline.path
  }
  render() {
    if (!this.path) return

    gsap.to(this.model.position, {
      x: this.spline.position.x,
      y: this.spline.position.y,
      z: this.spline.position.z,
      duration: 4,
      ease: 'power4.out'
    })
  }
}
