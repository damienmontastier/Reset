export default class Hitbox extends THREE.Object3D {
  constructor(mesh) {
    super()
    this.mesh = mesh

    this.mesh.geometry.computeBoundingBox()

    this.box = new THREE.Box3()

    this.update()
  }

  update() {
    this.box
      .copy(this.object.geometry.boundingBox)
      .applyMatrix4(this.object.matrixWorld)
  }
}
