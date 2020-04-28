import Events from 'events'
import gsap from 'gsap'

import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

const JUMP_DURATION = 0.1

export default class Player extends THREE.Object3D {
  constructor() {
    super()

    this.init()

    // const { raf } = useGame()
    // raf.add('player', this.loop.bind(this))
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
    // group that wrap model this > innerGroup > model
    this.innerGroup = new THREE.Group()
    // this.innerGroup.position.copy(this.cellCenter)
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
    this.hitboxMesh.position.copy(new THREE.Vector3(0, 0.5, 0))
    this.hitboxMesh.scale.set(0.4, 1, 0.4)
    this.add(this.hitboxMesh)
    this.hitboxMesh.visible = false
    this.hitbox = new INTERSECTIONS.Hitbox(this.hitboxMesh, {
      layers: ['player'],
      filters: ['treadmill', 'parcel_post', 'treadmill_edge'],
      sleeping: false,
      kinematic: false
    })

    const { intersections } = useGame()
    intersections.addHitbox(this.hitbox)
  }

  async init() {
    this.events = new Events()
    await this.load()

    this.initAnimations()
    this.initModel()
    this.initHitbox()

    this.animations.idle.play()
  }

  destroy() {
    keyboadEvents.off('keydown', this.onKeydownHandler)
    raf.remove('player')
  }

  // loop(clock) {
  //   if (this.positionTween) {
  //     const time = this.positionTween.time()
  //     this.positionTween.time(time + clock.deltaTime)
  //   }
  // }

  moveTo(position) {
    const tl = new gsap.timeline()

    tl.to(this.position, {
      duration: JUMP_DURATION,
      x: position.x,
      y: position.y,
      z: position.z
    })

    this.positionTween = tl

    this.positionTween.eventCallback('onStart', () => {})

    this.positionTween.eventCallback('onComplete', () => {
      requestAnimationFrame(() => {
        this.positionTween = false
      })
    })
  }

  // jumpAnimation() {
  //   const duration = JUMP_DURATION

  //   const tl = new gsap.timeline()

  //   // tl.to(
  //   //   this.position,
  //   //   {
  //   //     duration: duration * 0.3,
  //   //     y: this.nextPosition.y + 0.5
  //   //   },
  //   //   duration * 0.4
  //   // )

  //   // tl.to(
  //   //   this.position,
  //   //   {
  //   //     duration: duration * 0.3,
  //   //     y: this.nextPosition.y
  //   //   },
  //   //   duration * 0.7
  //   // )

  //   // tl.to(
  //   //   this.position,
  //   //   {
  //   //     duration: duration * 0.75,
  //   //     x: this.nextPosition.x,
  //   //     z: this.nextPosition.z,
  //   //     ease: 'power2.in'
  //   //   },
  //   //   duration * 0.1
  //   // )

  //   tl.to(this.position, {
  //     duration,
  //     x: this.nextPosition.x,
  //     y: this.nextPosition.y,
  //     z: this.nextPosition.z
  //   })

  //   tl.pause()

  //   return tl
  // }

  get worldPosition() {
    return this.getWorldPosition(new THREE.Vector3())
  }
}
