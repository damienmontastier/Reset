import Events from 'events'
import gsap from 'gsap'

import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'
import useRAF from '@/hooks/use-raf'
import useGUI from '@/hooks/use-gui'

import useAudio from '@/hooks/use-audio'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

import PlayerBasicMaterial from '@/webgl/materials/m-player/basic'
import PlayerStandardMaterial from '@/webgl/materials/m-player/standard'

let SkeletonUtils

const trailMaterial = new THREE.MeshBasicMaterial({
  skinning: true,
  transparent: true,
  color: 0x2ff000,
  wireframe: true,
  opacity: 0.25,
  depthWrite: false,
  depthTest: true
})

// const playerWireframeMaterial = new PlayerBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true
// })

const playerStandardMaterial = new PlayerStandardMaterial({
  emissive: 0x00000,
  flatShading: true
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
    const audioManager = useAudio()

    await audioManager.add([
      { path: '/sounds/RESET_DASH_1.mp3', id: 'dash_01' },
      { path: '/sounds/RESET_DASH_2.mp3', id: 'dash_02' },
      { path: '/sounds/RESET_DASH_3.mp3', id: 'dash_03' },
      { path: '/sounds/RESET_DASH_4.mp3', id: 'dash_04' },
      { path: '/sounds/RESET_POST.mp3', id: 'fall_01' }
    ])

    const assetsManager = useAssetsManager()

    assetsManager.loader.addGroup({
      name: 'character',
      base: '/',
      files: [
        {
          name: 'model',
          path: 'obj/character/character 06_Idle_Run_Fall_T-Pose.glb'
        }
      ]
    })

    this.files = await assetsManager.get('character')

    this.model = this.files.model.scene
    this.modelAnimations = this.files.model.animations

    const GUI = useGUI()

    GUI.addObject3D('model', this.model)

    this.model.rotation.y = THREE.MathUtils.degToRad(180)

    const materialBlack = playerStandardMaterial.clone()
    const materialGreen = playerStandardMaterial.clone()
    materialGreen.uniforms.emissive.value = new THREE.Color(0x2ff000)

    this.model.getObjectByName('black').material = materialBlack
    this.model.getObjectByName('green').material = materialGreen
  }

  initAnimations() {
    this.animationMixer = new THREE.AnimationMixer(this.model)

    this.animations = {
      idle: this.animationMixer.clipAction(
        THREE.AnimationClip.findByName(this.modelAnimations, 'idle')
      ),
      run: this.animationMixer.clipAction(
        THREE.AnimationClip.findByName(this.modelAnimations, 'run')
      ),
      fall: this.animationMixer.clipAction(
        THREE.AnimationClip.findByName(this.modelAnimations, 'fall')
      ),
      tPose: this.animationMixer.clipAction(
        THREE.AnimationClip.findByName(this.modelAnimations, 'T-Pose')
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

  setInitialState() {
    this.model.rotation.y = THREE.MathUtils.degToRad(180)
    this.animations.run.stop()
    this.animations.fall.stop()
    this.animations.idle.stop()
  }

  async init() {
    this.events = new Events()
    await this.load()

    this.trails = []

    this.initAnimations()
    this.initModel()
    this.initSkeleton()
    this.initHitbox()

    this.setInitialState()

    const RAF = useRAF()
    RAF.add('player', this.loop.bind(this))
  }

  destroy() {
    keyboadEvents.off('keydown', this.onKeydownHandler)

    const RAF = useRAF()
    RAF.remove('player')
  }

  fall() {
    const audioManager = useAudio()
    audioManager.play('fall_01')

    this.isFalling = true
    if (this.positionTween) {
      this.positionTween.kill()
      this.positionTween = null
    }

    this.animations.idle.stop()
    this.animations.run.stop()
    this.animations.fall.play()

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.animations.fall.stop()
        this.isFalling = false

        console.log('stop falling')
        resolve()
      }, 700)
    })
  }

  initSkeleton() {
    const skeleton = SkeletonUtils.clone(this.model)

    const playerWireframeMaterial = new PlayerBasicMaterial({
      color: 0x00ff00,
      wireframe: true
    })

    skeleton.getObjectByName('black').material = playerWireframeMaterial
    skeleton.getObjectByName('green').material = playerWireframeMaterial

    skeleton.position.copy(this.position)

    // this.innerGroup.add(skeleton)
  }

  startPlayerDisplay() {
    this.model.getObjectByName('black').material.uniforms.uThreshold.value = 2
    this.model.getObjectByName('green').material.uniforms.uThreshold.value = 2

    gsap.to(this.model.getObjectByName('black').material.uniforms.uThreshold, {
      value: 0,
      duration: 10,
      delay: 1
    })
  }

  moveTo(position) {
    const audioManager = useAudio()
    const dashs = ['dash_01', 'dash_02', 'dash_03', 'dash_04']
    const dashSound = dashs[Math.floor(Math.random() * dashs.length)]
    audioManager.play(dashSound)

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

    this.animations.run.play()

    // trail.getObjectByName('black').material.dispose()
    // trail.getObjectByName('green').material.dispose()

    const material = trailMaterial.clone()
    trail.getObjectByName('black').material = material
    trail.getObjectByName('green').material = material

    const { scene } = useGame()
    scene.add(trail)

    gsap.to(material, {
      opacity: 0,
      duration: 0.7,
      ease: 'expo.out',
      onComplete: () => {
        trail.traverse((child) => {
          if (child.skeleton && child.skeleton.boneTexture) {
            child.skeleton.boneTexture.dispose()
          }
        })

        scene.remove(trail)
        material.dispose()
      }
    })

    const tl = new gsap.timeline()

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
        this.animations.run.stop()
        this.positionTween = false
      })
    })
  }

  get worldPosition() {
    return this.getWorldPosition(new THREE.Vector3())
  }
}
