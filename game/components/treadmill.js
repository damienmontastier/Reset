import useGame from '@/hooks/use-game'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'
import ParcelPost from '@/game/components/parcel-post'

import BoxGeometry from '@/webgl/geometries/box'

export default class Treadmill extends THREE.Object3D {
  constructor(model, index) {
    super()
    this.index = index
    this.model = model
    this.add(this.model)
    this.model.matrixAutoUpdate = false

    this.initOutHiboxes()
    this.initHitbox()
    this.initParcelPostsApparition()
  }

  initOutHiboxes() {
    const { intersections } = useGame()

    const box = new THREE.Mesh(BoxGeometry, new THREE.MeshBasicMaterial())

    // up stream
    this.outHitboxUpstreamMesh = box.clone()
    this.outHitboxUpstreamMesh.position.copy(new THREE.Vector3(-6, 1, 0))

    this.add(this.outHitboxUpstreamMesh)
    this.outHitboxUpstreamMesh.visible = false
    this.outHitboxUpstream = new INTERSECTIONS.Hitbox(
      this.outHitboxUpstreamMesh,
      {
        layers: ['treadmill_out_hitbox'],
        filters: ['parcel_post'],
        sleeping: true
      }
    )

    intersections.addHitbox(this.outHitboxUpstream)

    // this.outHitboxUpstream.events.on('intersection', (intersections) => {
    //   console.log(intersections)
    // })

    // down stream
    this.outHitboxDownstreamMesh = box.clone()
    this.outHitboxDownstreamMesh.position.copy(new THREE.Vector3(6, 1, 0))

    this.add(this.outHitboxDownstreamMesh)
    this.outHitboxDownstreamMesh.visible = false
    this.outHitboxDownstreamMesh = new INTERSECTIONS.Hitbox(
      this.outHitboxDownstreamMesh,
      {
        layers: ['treadmill_out_hitbox'],
        filters: ['parcel_post'],
        sleeping: true
      }
    )

    intersections.addHitbox(this.outHitboxDownstreamMesh)

    // this.outHitboxDownstreamMesh.events.on('intersection', (intersections) => {
    //   console.log(intersections)
    // })
  }

  initHitbox() {
    this.hitboxMesh = this.model.getObjectByName('hitbox')
    this.hitboxMesh.visible = false

    this.hitbox = new INTERSECTIONS.Hitbox(this.hitboxMesh, {
      layers: ['treadmill'],
      filters: [],
      sleeping: true
    })

    const { intersections } = useGame()
    intersections.addHitbox(this.hitbox)
  }

  initParcelPostsApparition() {
    this.parcelPosts = new THREE.Group()
    this.add(this.parcelPosts)

    this.direction = Math.random() > 0.5 ? 1 : -1
    this.speed = Math.random() / 10
    this.appearFrequencyBasis = 0.5
    this.appearFrequencyRandomness = 1

    this.spawnPoint =
      this.direction > 0
        ? new THREE.Vector3(-4.5, 1, 0)
        : new THREE.Vector3(4.5, 1, 0)
  }

  get appearFrequency() {
    return (
      this.appearFrequencyBasis + Math.random() * this.appearFrequencyRandomness
    )
  }

  get deltaPosition() {
    return new THREE.Vector3(this.direction * this.speed, 0, 0)
  }

  update(clock) {
    if (this.index > 0) return
    this.parcelPosts.children.forEach((post) => {
      post.position.add(this.deltaPosition)
    })
    this.time = (this.time || 0) + clock.deltaTime
    if (this.time > this.appearFrequency) {
      this.time = 0
      this.addParcelPost()
    }
  }

  addParcelPost() {
    const postMesh = new THREE.Mesh(
      BoxGeometry,
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    postMesh.scale.set(1, 0.5, 0.5)

    const post = new ParcelPost(postMesh)
    post.position.copy(this.spawnPoint)
    this.parcelPosts.add(post)

    // setTimeout(() => {
    //   this.parcelPosts.remove(post)
    // }, 100)
  }
}
