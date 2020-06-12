import Events from 'events'
import gsap from 'gsap'

import useAssetsManager from '@/hooks/use-assets-manager'
import useGame from '@/hooks/use-game'
import useRAF from '@/hooks/use-raf'
import useGUI from '@/hooks/use-gui'

import useAudio from '@/hooks/use-audio'

import * as INTERSECTIONS from '@/webgl/plugins/intersections'

import PlayerMaterial from '@/webgl/materials/mPlayer/standard'

let SkeletonUtils

const trailMaterial = new THREE.MeshBasicMaterial({
  skinning: true,
  transparent: true,
  color: 0x00ff00,
  wireframe: true,
  opacity: 0.25,
  side: THREE.DoubleSide
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
      { path: '/sounds/dash_01.mp3', id: 'dash_01' },
      { path: '/sounds/dash_02.mp3', id: 'dash_02' },
      { path: '/sounds/dash_03.mp3', id: 'dash_03' },
      { path: '/sounds/dash_04.mp3', id: 'dash_04' },
      { path: '/sounds/fall_01.mp3', id: 'fall_01' }
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

    this.modelSkinMaterial = new THREE.MeshStandardMaterial({
      skinning: true,
      flatShading: true
    })

    this.modelSkinMaterial2 = new THREE.MeshStandardMaterial({
      skinning: true,
      emissive: 0xffffff,
      flatShading: true
    })

    console.log(this.modelSkinMaterial2)

    GUI.addMaterial('modelSkinMaterial', this.modelSkinMaterial)
    GUI.addMaterial('modelSkinMaterial2', this.modelSkinMaterial2)

    const playerMaterial = new PlayerMaterial({
      flatShading: true,
      diffuse: 0xff0000
    })
    // const playerMaterialClone = playerMaterial.clone()

    GUI.addMaterial('playerMaterial', playerMaterial)

    this.model.getObjectByName('black').material = playerMaterial
    this.model.getObjectByName('green').material = playerMaterial
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
    audioManager.play('fall_01').volume(1)

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

  addSkeleton() {
    const trail = SkeletonUtils.clone(this.model)
    // const material = trailMaterial.clone()

    const playerMaterial = new PlayerMaterial({
      wireframe: true,
      color: 0x00ff00,
      diffuse: 0x00ff00
    })

    trail.getObjectByName('black').material = playerMaterial
    trail.getObjectByName('green').material = playerMaterial

    trail.position.copy(this.position)

    // const { scene } = useGame()

    // scene.add(trail)
  }

  moveTo(position) {
    const audioManager = useAudio()
    const dashs = ['dash_01', 'dash_02', 'dash_03', 'dash_04']
    const dashSound = dashs[Math.floor(Math.random() * dashs.length)]
    audioManager.play(dashSound).volume(0.75)

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
