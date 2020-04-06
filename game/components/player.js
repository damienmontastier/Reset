// import TWEEN from '@tweenjs/tween.js'
import gsap from 'gsap'

import useKeyboard from '@/hooks/use-keyboard'
import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

import raf from '@/plugins/raf'

const JUMP_DURATION = 0.25

export default class Player extends THREE.Object3D {
  constructor({ terrain } = {}) {
    super()
    this.terrain = terrain

    this.init()

    raf.add('player', this.loop.bind(this))
  }

  async load() {
    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'character',
      base: '/',
      files: [
        {
          name: 'model',
          path: 'obj/character/character.glb'
        }
      ]
    })

    this.files = await assetsManager.get('character')

    this.model = this.files.model.scene
    this.modelAnimations = this.files.model.animations

    // to remove
    this.model.rotation.y = 135
  }

  initAnimations() {
    this.animationMixer = new THREE.AnimationMixer(this.model)

    this.animations = {
      walking: this.animationMixer.clipAction(
        THREE.AnimationClip.findByName(this.modelAnimations, 'walking')
      ),
      idle: this.animationMixer.clipAction(
        THREE.AnimationClip.findByName(this.modelAnimations, 'idle')
      )
    }
  }

  initModel() {
    this.cellSize = new THREE.Vector3(1, 1, 1)
    this.cellCenter = new THREE.Vector3(
      -this.cellSize.x / 2,
      0,
      -this.cellSize.z / 2
    )

    // group that wrap model this > innerGroup > model
    this.innerGroup = new THREE.Group()
    this.innerGroup.position.copy(this.cellCenter)
    this.add(this.innerGroup)

    this.innerGroup.add(this.model)

    this.pathfinder = new THREE.Group()
    this.innerGroup.add(this.pathfinder)
  }

  initHitbox() {
    this.hitboxMesh = new THREE.Mesh(
      new THREE.BoxBufferGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial()
    )
    this.hitboxMesh.position.copy(new THREE.Vector3(-0.5, 0.5, -0.5))
    this.add(this.hitboxMesh)
    this.hitboxMesh.visible = false
    this.hitbox = new INTERSECTIONS.Hitbox(this.hitboxMesh)

    const { intersections } = useGame()
    intersections.addHitbox(this.hitbox)
  }

  async init() {
    await this.load()

    this.initAnimations()
    this.initModel()
    this.initHitbox()

    this.animations.idle.play()

    const { events: keyboardEvents } = useKeyboard()

    this.onKeydownHandler = this.onKeydown.bind(this)
    keyboardEvents.on('keydown', this.onKeydownHandler)
  }

  destroy() {
    keyboadEvents.off('keydown', this.onKeydownHandler)
    raf.remove('player')
  }

  loop(deltaTime) {
    if (this.positionTween) {
      const time = this.positionTween.time()
      this.positionTween.time(time + deltaTime)
    }

    // if (this.animationMixer) {
    //   this.animationMixer.update(deltaTime * (1 / JUMP_DURATION))
    // }
  }

  onKeydown(e) {
    const delta = new THREE.Vector3()

    // keysHandler
    switch (e.code) {
      case 'ArrowLeft':
        delta.x -= this.cellSize.x
        break
      case 'ArrowRight':
        delta.x += this.cellSize.x
        break
      case 'ArrowDown':
        delta.z += this.cellSize.z
        break
      case 'ArrowUp':
        delta.z -= this.cellSize.z
        break
      default:
        break
    }

    // move pathfinder
    this.pathfinder.position.add(delta)
    this.moveTo(this.pathfinder.getWorldPosition(new THREE.Vector3()))

    // reset pathfinder
    this.pathfinder.position.copy(new THREE.Vector3())
  }

  moveTo(position) {
    const intersects = this.terrain.castCell(position)

    if (intersects.length) {
      // player can walk
      const intersect = intersects[0]
      const point = intersect.point

      // get scale
      const scale = new THREE.Vector3()
      this.matrixWorld.decompose(
        new THREE.Vector3(),
        new THREE.Quaternion(),
        scale
      )

      // apply scale
      point.divide(scale)

      // set next position
      this.nextPosition = point.clone()

      // set to center of the cell
      this.nextPosition.sub(this.cellCenter)

      if (!this.positionTween) {
        this.positionTween = this.jumpAnimation()
        this.positionTween.eventCallback('onStart', () => {
          // this.animations.idle.stop()
          // this.animations.walking.play()
        })
        this.positionTween.eventCallback('onComplete', () => {
          // this.animations.walking.stop()
          // this.animations.idle.play()
          this.positionTween = null
        })
      }
    }
  }

  jumpAnimation() {
    const duration = JUMP_DURATION

    const tl = new gsap.timeline()

    // tl.to(
    //   this.position,
    //   {
    //     duration: duration * 0.3,
    //     y: this.nextPosition.y + 0.5
    //   },
    //   duration * 0.4
    // )

    // tl.to(
    //   this.position,
    //   {
    //     duration: duration * 0.3,
    //     y: this.nextPosition.y
    //   },
    //   duration * 0.7
    // )

    // tl.to(
    //   this.position,
    //   {
    //     duration: duration * 0.75,
    //     x: this.nextPosition.x,
    //     z: this.nextPosition.z,
    //     ease: 'power2.in'
    //   },
    //   duration * 0.1
    // )

    tl.to(this.position, {
      duration,
      x: this.nextPosition.x,
      y: this.nextPosition.y,
      z: this.nextPosition.z
    })

    tl.pause()

    return tl
  }
}
