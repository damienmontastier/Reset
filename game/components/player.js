// import TWEEN from '@tweenjs/tween.js'
import gsap from 'gsap'

import useKeyboard from '@/hooks/use-keyboard'
import useAssetsManager from '@/hooks/use-assets-manager'

import raf from '@/plugins/raf'

export default class Player extends THREE.Object3D {
  constructor({ gridTerrain } = {}) {
    super()
    this.gridTerrain = gridTerrain

    this.pathfinder = new THREE.Group()

    this.load().then(() => {
      this.init()
    })

    // this.load()
    // this.init()

    raf.add('player', this.loop.bind(this))
  }

  load() {
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

    return new Promise((resolve, reject) => {
      assetsManager.get('character').then((files) => {
        const { model } = files

        this.modelGLB = model
        this.model = this.modelGLB.scene
        // this.model.position.set(-0.5, 0, -0.5)
        this.model.scale.setScalar(3)
        this.model.rotation.y = 135
        // this.add(this.model)

        this.initAnimations()

        resolve(files)
      })
    })
  }

  initAnimations() {
    this.mixer = new THREE.AnimationMixer(this.model)
    this.clips = this.modelGLB.animations

    this.action = this.mixer.clipAction(this.clips[0])
    this.action.play()
  }

  // load() {
  // this.modelGroup = new THREE.Group()
  // this.add(this.modelGroup)
  // this.model = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  // )
  // this.modelGroup.add(this.model).position.set(-0.5, 0.5, -0.5)
  // this.pathfinder = new THREE.Group()
  // this.modelGroup.add(this.pathfinder)
  // }

  loop(deltaTime) {
    if (this.mixer) {
      this.mixer.update(deltaTime * 3)
    }
    if (this.positionTween) {
      const time = this.positionTween.time()
      this.positionTween.time(time + deltaTime)
    }
  }

  init() {
    this.modelGroup = new THREE.Group()
    this.add(this.modelGroup)
    // this.model = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // )
    console.log(this.modelGLB)
    this.modelGroup.add(this.model)
    this.modelGroup.position.set(-0.5, 0, -0.5)
    this.pathfinder = new THREE.Group()
    this.modelGroup.add(this.pathfinder)

    const { events } = useKeyboard()

    events.on('keydown', (e) => {
      if (this.positionTween) return

      const delta = new THREE.Vector3()
      switch (e.code) {
        case 'ArrowLeft':
          delta.x -= 1
          break
        case 'ArrowRight':
          delta.x += 1
          break
        case 'ArrowDown':
          delta.z += 1
          break
        case 'ArrowUp':
          delta.z -= 1
          break
        default:
          break
      }

      this.pathfinder.position.add(delta)
      const intersects = this.gridTerrain.castCell(
        this.pathfinder.getWorldPosition(new THREE.Vector3())
      )
      if (intersects[0]) {
        const point = intersects[0].point
        const scale = new THREE.Vector3()
        this.matrixWorld.decompose(
          new THREE.Vector3(),
          new THREE.Quaternion(),
          scale
        )

        const y = point.divide(scale).y

        this.nextPosition = this.position.clone().add(delta)
        this.nextPosition.y = y

        this.action = this.mixer.clipAction(this.clips[2])
        this.action.play()

        this.positionTween = gsap
          .to(this.position, {
            duration: 0.2,
            x: this.nextPosition.x,
            y: this.nextPosition.y,
            z: this.nextPosition.z,
            // ease: 'power4.out',
            onComplete: () => {
              this.positionTween = undefined
              this.action.stop()
              this.action = this.mixer.clipAction(this.clips[0])
              this.action.play()
            }
          })
          .pause()
      }
      this.pathfinder.position.copy(new THREE.Vector3())
    })
  }
}
