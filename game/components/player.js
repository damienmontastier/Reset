// import TWEEN from '@tweenjs/tween.js'
import gsap from 'gsap'

import useKeyboard from '@/hooks/use-keyboard'
import useAssetsManager from '@/hooks/use-assets-manager'

import raf from '@/plugins/raf'

export default class Player extends THREE.Object3D {
  constructor({ terrain } = {}) {
    super()
    this.terrain = terrain

    // this.pathfinder = new THREE.Group()

    // this.load().then(() => {
    //   this.init()
    // })

    // this.load()
    // this.init()

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

  async init() {
    await this.load()

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

    const { events: keyboardEvents } = useKeyboard()

    this.onKeydownHandler = this.onKeydown.bind(this)
    keyboardEvents.on('keydown', this.onKeydownHandler)
  }

  destroy() {
    keyboadEvents.off('keydown', this.onKeydownHandler)
  }

  loop(deltaTime) {
    if (this.positionTween) {
      const time = this.positionTween.time()
      this.positionTween.time(time + deltaTime)
    }
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
      // this.position.copy(point.clone())

      // set to center of the cell
      this.nextPosition.sub(this.cellCenter)
      // this.position.sub(this.cellCenter)

      this.positionTween = gsap
        .to(this.position, {
          duration: 0.2,
          x: this.nextPosition.x,
          y: this.nextPosition.y,
          z: this.nextPosition.z,
          ease: 'power4.out',
          onComplete: () => {
            this.positionTween = undefined
            // this.action.stop()
            // this.action = this.mixer.clipAction(this.clips[0])
            // this.action.play()
          }
        })
        .pause()
    }
  }

  // load() {
  //   const assetsManager = useAssetsManager()

  //   assetsManager.loader.addGroup({
  //     name: 'character',
  //     base: '/',
  //     files: [
  //       {
  //         name: 'model',
  //         path: 'obj/character/character.glb'
  //       }
  //     ]
  //   })

  //   return new Promise((resolve, reject) => {
  //     assetsManager.get('character').then((files) => {
  //       const { model } = files

  //       this.modelGLB = model
  //       this.model = this.modelGLB.scene
  //       // this.model.position.set(-0.5, 0, -0.5)
  //       this.model.scale.setScalar(3)
  //       this.model.rotation.y = 135
  //       // this.add(this.model)

  //       this.initAnimations()

  //       resolve(files)
  //     })
  //   })
  // }

  // initAnimations() {
  //   this.mixer = new THREE.AnimationMixer(this.model)
  //   this.clips = this.modelGLB.animations

  //   this.action = this.mixer.clipAction(this.clips[0])
  //   this.action.play()
  // }

  // loop(deltaTime) {
  //   if (this.mixer) {
  //     this.mixer.update(deltaTime * 3)
  //   }
  //   if (this.positionTween) {
  //     const time = this.positionTween.time()
  //     this.positionTween.time(time + deltaTime)
  //   }
  // }

  // init() {
  //   this.modelGroup = new THREE.Group()
  //   this.add(this.modelGroup)
  //   // this.model = new THREE.Mesh(
  //   //   new THREE.BoxGeometry(1, 1, 1),
  //   //   new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  //   // )
  //   this.modelGroup.add(this.model)
  //   this.modelGroup.position.set(-0.5, 0, -0.5)
  //   this.pathfinder = new THREE.Group()
  //   this.modelGroup.add(this.pathfinder)

  //   const { events } = useKeyboard()

  //   events.on('keydown', (e) => {
  //     if (this.positionTween) return

  //     const delta = new THREE.Vector3()
  //     switch (e.code) {
  //       case 'ArrowLeft':
  //         delta.x -= 1
  //         break
  //       case 'ArrowRight':
  //         delta.x += 1
  //         break
  //       case 'ArrowDown':
  //         delta.z += 1
  //         break
  //       case 'ArrowUp':
  //         delta.z -= 1
  //         break
  //       default:
  //         break
  //     }

  //     this.pathfinder.position.add(delta)
  //     const intersects = this.terrain.castCell(
  //       this.pathfinder.getWorldPosition(new THREE.Vector3())
  //     )
  //     console.log(intersects)
  //     if (intersects[0]) {
  //       const intersect = intersects[0]
  //       console.log(intersect.object.name)
  //       const point = intersect.point
  //       const scale = new THREE.Vector3()
  //       this.matrixWorld.decompose(
  //         new THREE.Vector3(),
  //         new THREE.Quaternion(),
  //         scale
  //       )

  //       const y = point.divide(scale).y

  //       this.nextPosition = this.position.clone().add(delta)
  //       this.nextPosition.y = y

  //       this.action = this.mixer.clipAction(this.clips[2])
  //       this.action.play()

  //       this.positionTween = gsap
  //         .to(this.position, {
  //           duration: 0.1,
  //           x: this.nextPosition.x,
  //           y: this.nextPosition.y,
  //           z: this.nextPosition.z,
  //           // ease: 'power4.out',
  //           onComplete: () => {
  //             this.positionTween = undefined
  //             this.action.stop()
  //             this.action = this.mixer.clipAction(this.clips[0])
  //             this.action.play()
  //           }
  //         })
  //         .pause()
  //     }
  //     this.pathfinder.position.copy(new THREE.Vector3())
  //   })
  // }
}
