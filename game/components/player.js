import Events from 'events'
import gsap from 'gsap'

// import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils.js'

import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'
import useRAF from '@/hooks/use-raf'
import useGUI from '@/hooks/use-gui'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

let SkeletonUtils

const trailMaterial = new THREE.MeshBasicMaterial({
  skinning: true,
  transparent: true,
  color: 0x00ff00,
  wireframe: true,
  opacity: 0.25
})

// const JUMP_DURATION = 0.1

export default class Player extends THREE.Object3D {
  constructor() {
    super()
    SkeletonUtils = require('three/examples/jsm/utils/SkeletonUtils.js')
      .SkeletonUtils
  }
  loop({ deltaTime }) {
    this.animationMixer.update(deltaTime)
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

    const GUI = useGUI()

    GUI.addObject3D('model', this.model)

    this.model.rotation.y = THREE.MathUtils.degToRad(180)

    this.modelSkinMaterial = new THREE.MeshStandardMaterial({
      skinning: true,
      flatShading: true
    })

    const m2 = new THREE.MeshStandardMaterial({
      skinning: true,
      emissive: 0xffffff,
      flatShading: true
    })

    GUI.addMaterial('m', this.modelSkinMaterial)
    GUI.addMaterial('m2', m2)

    this.model.getObjectByName('black').material = this.modelSkinMaterial
    this.model.getObjectByName('green').material = m2
  }

  initAnimations() {
    this.animationMixer = new THREE.AnimationMixer(this.model)

    this.animations = {
      idle: this.animationMixer.clipAction(
        THREE.AnimationClip.findByName(this.modelAnimations, 'idle')
      ),
      run: this.animationMixer.clipAction(
        THREE.AnimationClip.findByName(this.modelAnimations, 'run')
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

    this.trails = []

    this.initAnimations()
    this.initModel()
    this.initHitbox()

    this.animations.idle.play()

    const RAF = useRAF()
    RAF.add('id', this.loop.bind(this))
  }

  destroy() {
    keyboadEvents.off('keydown', this.onKeydownHandler)
    raf.remove('player')
  }

  moveTo(position) {
    const tl = new gsap.timeline()

    const d = this.position
      .clone()
      .sub(position)
      .round()
    let rotation
    if (d.x === -1) {
      rotation = 90
    }

    if (d.z === 1) {
      rotation = 180
    }

    if (d.x === 1) {
      rotation = 270
    }

    if (d.z === -1) {
      rotation = 360
    }

    const trail = SkeletonUtils.clone(this.model)

    trail.applyMatrix4(this.model.matrixWorld)
    trail.rotation.copy(new THREE.Euler())
    trail.rotation.y = THREE.MathUtils.degToRad(rotation)

    const material = trailMaterial.clone()
    trail.getObjectByName('black').material = material
    trail.getObjectByName('green').material = material

    this.animations.run.play()

    setTimeout(() => {
      this.animations.run.stop()
    }, 150)

    const { scene } = useGame()
    scene.add(trail)

    gsap.to(material, {
      opacity: 0,
      duration: 0.7,
      ease: 'expo.out',
      onComplete: () => {
        scene.remove(trail)
        material.dispose()
      }
    })

    tl.to(
      this.model.rotation,
      {
        duration: 0.12,
        y: THREE.MathUtils.degToRad(rotation)
      },
      0
    )

    tl.to(
      this.position,
      {
        duration: 0.12,
        x: position.x,
        y: position.y,
        z: position.z
      },
      0
    )

    this.positionTween = tl

    this.positionTween.eventCallback('onStart', () => {})

    this.positionTween.eventCallback('onComplete', () => {
      requestAnimationFrame(() => {
        this.positionTween = false
      })
    })
  }

  get worldPosition() {
    return this.getWorldPosition(new THREE.Vector3())
  }
}
