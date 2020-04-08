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

    // this.initOutHiboxes()
    this.initHitbox()
    this.initParcelPostsApparition()
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
    this.speed = Math.max(Math.random(), 0.5) / 15
    this.appearFrequencyBasis = 1.5
    this.appearFrequencyRandomness = 1

    this.spawnPoint =
      this.direction > 0
        ? new THREE.Vector3(-4, 1, 0)
        : new THREE.Vector3(4, 1, 0)
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
    // if (this.index > 3) return
    this.parcelPosts.children.forEach((post) => {
      post.position.add(this.deltaPosition)
      post.updateMatrixWorld()
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
