import useGame from '@/hooks/use-game'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

import BoxGeometry from '@/webgl/geometries/box'

export default class ParcelPost extends THREE.Object3D {
  constructor(model) {
    super()
    this.model = model
    this.add(this.model)

    this.initHitbox()
  }

  initHitbox() {
    this.hitboxMesh = new THREE.Mesh(BoxGeometry, new THREE.MeshBasicMaterial())

    // this.hitboxMesh.position.copy(new THREE.Vector3(-0.5, 0.5, -0.5))
    this.hitboxMesh.scale.setScalar(1)
    this.add(this.hitboxMesh)
    this.hitboxMesh.visible = false
    this.hitbox = new INTERSECTIONS.Hitbox(this.hitboxMesh, {
      layers: ['parcel_post'],
      filters: ['treadmill_out_hitbox']
    })

    const { intersections: intersectionsWorld } = useGame()
    intersectionsWorld.addHitbox(this.hitbox)

    this.onIntersectingHandler = this.onIntersecting.bind(this)
    this.hitbox.events.on('intersecting', this.onIntersectingHandler)
  }

  onIntersecting(intersections) {
    const outHitboxesIntersections = intersections.filter(
      (intersection) =>
        intersection.target._layers.includes('treadmill_out_hitbox') &&
        intersection.intersecting === true &&
        intersection.lastIntersecting !== undefined
    )

    if (outHitboxesIntersections.length > 0) {
      this.model.material.color = new THREE.Color(0xff0000)
      this.destroy()
    }
  }

  destroy() {
    const { intersections: intersectionsWorld } = useGame()
    intersectionsWorld.addHitbox(this.hitbox)

    this.parent.remove(this)
    intersectionsWorld.removeHitbox(this.hitbox)

    this.hitbox.events.off('intersecting', this.onIntersectingHandler)
  }
}
