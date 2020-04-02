import * as THREE from 'three'
import Raf from '@/plugins/raf'

export default class Worker extends THREE.Object3D {
  constructor({ model }) {
    super()

    this.model = model

    this.time = 0

    this.add(this.model)

    this.model.scale.multiplyScalar(10)

    Raf.add(this.model.uuid, this.render.bind(this), 0)
  }
  render() {}
}

// t: current time, b: begInnIng value, c: change In value, d: duration

// const easeInQuad = (x, t, b, c, d) => {
//   return c * (t /= d) * t + b
// }
