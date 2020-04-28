import SimplexNoise from 'simplex-noise'

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

    this.init()
  }

  init() {
    // hide post
    this.model.children[2].visible = false
    this.hookedGroup = []

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
    this.hitbox.userData.parentInstance = this

    const { intersections } = useGame()
    intersections.addHitbox(this.hitbox)
  }

  initParcelPostsApparition() {
    this.parcelPosts = new THREE.Group()
    this.add(this.parcelPosts)

    this.simplex = new SimplexNoise()

    this.direction = Math.random() > 0.5 ? 1 : -1
    this.speed = Math.max(Math.random(), 0.4) / 20

    this.appearIntervalBasis = 8

    this.appearInterval = this.getNewInterval()

    this.spawnPoint =
      this.direction > 0
        ? new THREE.Vector3(-4, 1, 0)
        : new THREE.Vector3(4, 1, 0)
  }

  getNewInterval() {
    const random = (this.simplex.noise2D(this.i, 0) + 1) * 0.5
    const interval = random * this.appearIntervalBasis
    return Math.max(interval, this.speed * 40)
  }

  get deltaPosition() {
    return new THREE.Vector3(this.direction * this.speed, 0, 0)
  }

  update(clock) {
    // if (this.index > 0) return
    this.parcelPosts.children.forEach((post) => {
      post.position.add(this.deltaPosition)
      post.updateMatrixWorld()
    })

    this.hookedGroup.forEach((child) => {
      child.position.add(this.deltaPosition)
    })

    this.time = (this.time || 0) + clock.deltaTime

    if (this.time > this.appearInterval) {
      this.i = (this.i || 0) + 1
      this.appearInterval = this.getNewInterval()
      this.time = 0
      this.addParcelPost()
    }
  }

  addParcelPost() {
    const postMesh = new THREE.Mesh(
      BoxGeometry,
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    postMesh.scale.set(0.7, 0.4, 0.5)

    const post = new ParcelPost(postMesh)
    post.position.copy(this.spawnPoint)
    this.parcelPosts.add(post)
  }

  hook(object) {
    this.hookedGroup.push(object)
  }

  unHook(object) {
    this.hookedGroup = this.hookedGroup.filter(
      (child) => child.uuid !== object.uuid
    )
  }
}
