import * as THREE from 'three'

export default class Drone extends THREE.Object3D {
  constructor({ model, circle }) {
    super()

    this.model = model

    this.circle = circle

    this.model.add(circle)

    this.add(this.model)
  }
}
