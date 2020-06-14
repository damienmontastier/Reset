import Events from 'events'

export default class Hitbox extends THREE.Object3D {
  constructor(
    mesh,
    { layers = [], filters = null, sleeping = false, kinematic = false } = {}
  ) {
    super()
    this.mesh = mesh

    this._layers = layers
    this.filters = filters
    this.sleeping = sleeping
    this.kinematic = kinematic

    this.mesh.geometry.computeBoundingBox()

    this.box = new THREE.Box3()

    this.helper = new THREE.Box3Helper(this.box, 0x2ff000)
    this.add(this.helper)

    this.intersections = {}

    this.events = new Events()

    // events :
    // 'intersecting' = emit intersecting status with all filtered hitboxes in the world every step
    // 'intersection' = emit every time hitbox enter/leave another

    this.update()
  }

  update() {
    this.box
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld)

    const intersecting = Object.values(this.intersections).some(
      (intersection) => intersection.intersecting
    )

    this.helper.material.color = new THREE.Color(
      intersecting ? 0xff0000 : 0x2ff000
    )
  }

  destroy() {
    this.helper.geometry.dispose()
    this.helper.material.dispose()
    this.remove(this.helper)
  }
}
