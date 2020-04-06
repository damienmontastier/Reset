import * as THREE from 'three'

export default class World extends THREE.Object3D {
  constructor() {
    super()

    this.hitboxes = new THREE.Group()

    this.add(this.hitboxes)
  }

  addHitbox(hitbox) {
    this.hitboxes.add(hitbox)
  }

  intersects() {
    // this.hitboxes.children.forEach((hitbox) => {
    //   this.hitboxes.children.forEach((target) => {
    //     const intersecting = hitbox.box.intersectsBox(target.box)
    //     console.log(intersecting)
    //   })
    // })
  }

  step() {
    this.hitboxes.children.forEach((hitbox) => {
      hitbox.update()
    })

    this.intersects()
  }
}
