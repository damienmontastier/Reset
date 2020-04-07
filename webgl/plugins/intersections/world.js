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
    // get intersections
    this.hitboxes.children.forEach((hitbox) => {
      this.hitboxes.children.forEach((target) => {
        if (hitbox.uuid !== target.uuid) {
          const lastIntersecting = hitbox.intersections[target.uuid]
            ? hitbox.intersections[target.uuid].intersecting
            : undefined

          const intersecting = hitbox.box.intersectsBox(target.box)

          const needsUpdate = intersecting !== lastIntersecting

          hitbox.intersections[target.uuid] = {
            intersecting,
            needsUpdate
          }
        }
      })
    })

    // emit collision events
    this.hitboxes.children.forEach((hitbox) => {
      const intersections = Object.values(hitbox.intersections).filter(
        (intersection) => intersection.needsUpdate
      )

      if (intersections.length) {
        hitbox.events.emit('intersection', intersections)
      }
    })
  }

  step() {
    this.hitboxes.children.forEach((hitbox) => {
      hitbox.update()
    })

    this.intersects()
  }

  destroy() {
    this.remove(this.hitboxes)
  }
}
