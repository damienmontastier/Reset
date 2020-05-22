// import SimplexNoise from 'simplex-noise'

import useGame from '@/hooks/use-game'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'
import ParcelPost from '@/game/components/parcel-post'

// import BoxGeometry from '@/webgl/geometries/box'

import colors from '@/config/colors'
import ToonMaterial from '@/webgl/materials/toon.js'

import treadmillConfig from '@/config/treadmills'

import windowFocus from '@/plugins/window-focus'

export default class Treadmill extends THREE.Object3D {
  constructor(model, wireframe, zone) {
    super()
    this.model = model
    this.wireframe = wireframe
    this.add(this.model)
    this.add(this.wireframe)
    this.model.matrixAutoUpdate = false
    this.wireframe.matrixAutoUpdate = false

    this.tapis = model.getObjectByName('tapis')
    this.tapisWireframe = wireframe.getObjectByName('tapis_wireframe_green')

    this.config = treadmillConfig[zone]

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

    this.direction = Math.random() > 0.5 ? 1 : -1

    this.random = Math.random()
    // treadmillConfig

    // this.speedScale = 0.05
    // this.speedMinimum = 0.5
    // this.speedRandomness = 0.5
    // this.speed =
    //   (this.speedMinimum + this.speedRandomness * Math.random()) *
    //   this.speedScale

    // this.appearIntervalMinimum = 0.5
    // this.appearIntervalRandomness = 3

    this.appearInterval = this.getNewInterval()

    this.spawnPoint =
      this.direction > 0
        ? new THREE.Vector3(-6.8, 1, 0)
        : new THREE.Vector3(6.8, 1, 0)
  }

  get speed() {
    return (
      (this.config.speedMinimum + this.config.speedRandomness * this.random) *
      this.config.speedScale
    )
  }

  getNewInterval() {
    return (
      this.config.appearIntervalMinimum +
      this.config.appearIntervalRandomness * Math.random()
    )
  }

  get deltaPosition() {
    return new THREE.Vector3(this.direction * this.speed, 0, 0)
  }

  update(clock) {
    // if (this.index > 1) return

    if (!windowFocus.visible) return

    const deltaPosition = this.deltaPosition.multiply(
      new THREE.Vector3(clock.lagSmoothing, 0, 0)
    )

    this.tapis.position.x += deltaPosition.x
    this.tapis.position.x %= 0.5

    this.tapisWireframe.position.x += deltaPosition.x
    this.tapisWireframe.position.x %= 0.5

    this.parcelPosts.children.forEach((post) => {
      post.position.add(deltaPosition)
      post.updateMatrixWorld()

      if (post.position.x > 50 || post.position.x < -50) {
        post.destroy()
      }
    })

    this.hookedGroup.forEach((child) => {
      child.position.add(deltaPosition)
      child.updateMatrixWorld()
    })

    this.time = (this.time || 0) + clock.deltaTime

    // console.log(this.appearInterval)
    if (this.time > this.appearInterval) {
      this.i = (this.i || 0) + 1
      this.appearInterval = this.getNewInterval()
      this.time = 0
      this.addParcelPost()
    }
  }

  addParcelPost() {
    const randomIndex = Math.floor(Math.random() * colors.posts.length)
    const [color, emissive] = colors.posts[randomIndex]

    const material = new ToonMaterial({
      color,
      emissive
    })

    const postMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      material
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
