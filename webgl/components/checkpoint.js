import CheckpointMaterial from '@/webgl/materials/checkpoint'

export default class Checkpoint extends THREE.Object3D {
  constructor() {
    super()

    this.scale.setScalar(0.95)
    this.geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    this.material1 = new CheckpointMaterial({ color: 0xffffff })
    this.material2 = new CheckpointMaterial({ color: 0xffffff })

    this.cube1 = new THREE.Mesh(this.geometry, this.material1)
    this.cube2 = new THREE.Mesh(this.geometry, this.material2)

    this.add(this.cube1)
    this.add(this.cube2)

    this.cube1.material.side = THREE.BackSide
    this.cube2.material.side = THREE.FrontSide

    this.matrixAutoUpdate = false
  }
}
