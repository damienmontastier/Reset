import * as THREE from 'three'

export default class World extends THREE.Object3D {
  constructor() {
    super()

    this.hitboxes = new THREE.Group()

    this.infos = {
      intersections: 0
    }

    this.add(this.hitboxes)
  }

  addHitbox(hitbox) {
    this.hitboxes.add(hitbox)
  }

  removeHitbox(hitbox) {
    hitbox.destroy()
    this.hitboxes.remove(hitbox)
    this.hitboxes.children.forEach((h) => {
      delete h.intersections[hitbox.uuid]
      //   hitbox.intersections = hitbox.intersections.filter((intersection) => {})
    })
  }

  intersects() {
    let i = 0
    console.time('intersections')
    // console.log(this.hitboxes.children.length)
    // get intersections
    let hitboxes = this.hitboxes.children

    // intersects if hitbox not sleeping
    hitboxes = hitboxes.filter((hitbox) => !hitbox.sleeping)

    hitboxes.forEach((hitbox) => {
      let targets = this.hitboxes.children

      // intersects if hitbox filters includes target layers
      if (hitbox.filters) {
        targets = targets.filter((target) =>
          hitbox.filters.some((filter) => target._layers.includes(filter))
        )
      }

      targets.forEach((target) => {
        // const distance = hitbox.box.distanceToPoint(
        //   target.box.getCenter(new THREE.Vector3())
        // )
        if (hitbox.uuid !== target.uuid) {
          // console.log(distance)
          i++

          const lastIntersecting = hitbox.intersections[target.uuid]
            ? hitbox.intersections[target.uuid].intersecting
            : undefined

          const intersecting = hitbox.box.intersectsBox(target.box)

          const needsUpdate = intersecting !== lastIntersecting

          // console.log(Object.keys(hitbox.intersections))

          hitbox.intersections[target.uuid] = {
            lastIntersecting,
            intersecting,
            needsUpdate,
            target
          }
        }
      })
    })

    // emit collision events
    this.hitboxes.children.forEach((hitbox) => {
      hitbox.events.emit('intersecting', Object.values(hitbox.intersections))

      const intersections = Object.values(hitbox.intersections).filter(
        (intersection) => intersection.needsUpdate
      )

      if (intersections.length) {
        hitbox.events.emit('intersection', intersections)
      }
    })
    console.timeEnd('intersections')
    this.infos.intersections = i
  }

  step() {
    let hitboxes = this.hitboxes.children

    hitboxes = hitboxes.filter((hitbox) => !hitbox.kinematic)

    hitboxes.forEach((hitbox) => {
      hitbox.update()
    })

    this.intersects()
  }

  destroy() {
    this.remove(this.hitboxes)
  }
}
