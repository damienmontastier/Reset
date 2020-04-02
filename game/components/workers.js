import * as THREE from 'three'
import gsap from 'gsap'
import Spline from '@/webgl/utils/spline'
import Raf from '@/plugins/raf'
// import useWebGL from '@/hooks/use-webgl'

export default class Workers extends THREE.Object3D {
  constructor({ model, spline = false }) {
    super()

    this.model = model
    this.spline = spline
    this.time = 0

    this.add(this.model)

    this.model.scale.multiplyScalar(10)

    if (this.spline) this.initSpline()

    Raf.add(this.model.uuid, this.render.bind(this), 0)
  }
  initSpline() {
    this.spline = new Spline({
      spline: this.spline,
      loop: false,
      autoplay: true,
      duration: 10
    })

    this.path = this.spline.path

    document.addEventListener('mousedown', () => {
      this.spline.start()
    })

    document.addEventListener('mouseup', () => {
      this.spline.stop()
    })
  }
  render() {
    if (!this.path) return

    // const { clock } = useWebGL()

    // const time = clock.getElapsedTime()

    // // console.log(easeInQuad(0.5, time, 0, 50, 1000))

    gsap.to(this.model.position, {
      x: this.spline.position.x,
      y: this.spline.position.y,
      z: this.spline.position.z,
      duration: 4,
      ease: 'power4.out'
    })
  }
}

// t: current time, b: begInnIng value, c: change In value, d: duration

// const easeInQuad = (x, t, b, c, d) => {
//   return c * (t /= d) * t + b
// }
