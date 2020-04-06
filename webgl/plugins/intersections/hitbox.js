export default class Hitbox extends THREE.Object3D {
  constructor(mesh) {
    super()
    this.mesh = mesh

    this.mesh.geometry.computeBoundingBox()

    this.box = new THREE.Box3()

    this.helper = new THREE.Box3Helper(this.box, 0x00ff00)
    this.add(this.helper)

    this.update()
  }

  update() {
    this.box
      .copy(this.mesh.geometry.boundingBox)
      .applyMatrix4(this.mesh.matrixWorld)
  }
}
