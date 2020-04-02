// import TWEEN from '@tweenjs/tween.js'
import gsap from 'gsap'

import useKeyboard from '@/hooks/use-keyboard'

import raf from '@/plugins/raf'

export default class Player extends THREE.Object3D {
  constructor({ gridTerrain }) {
    super()
    this.gridTerrain = gridTerrain
    this.load()
    this.init()

    raf.add('player', this.loop.bind(this))
  }

  load() {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    this.model = new THREE.Mesh(geometry, material)
    this.add(this.model)
    this.model.position.set(-0.5, 0.5, -0.5)

    this.pathfinder = new THREE.Group()
    this.model.add(this.pathfinder)
  }

  loop(deltaTime) {
    if (this.positionTween) {
      const time = this.positionTween.time()
      this.positionTween.time(time + deltaTime)
    }
  }

  init() {
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
        // this.position.add(delta)
        // this.position.y = y

        this.nextPosition = this.position.clone().add(delta)
        this.nextPosition.y = y
        // this.positionTween = new TWEEN.Tween(this.position)
        //   .to(
        //     {
        //       x: this.nextPosition.x,
        //       y: this.nextPosition.y,
        //       z: this.nextPosition.z
        //     },
        //     1000
        //   )
        //   .easing(TWEEN.Easing.Quadratic.Out)
        //   .start()

        this.positionTween = gsap
          .to(this.position, {
            duration: 0.4,
            x: this.nextPosition.x,
            y: this.nextPosition.y,
            z: this.nextPosition.z,
            ease: 'power4.out',
            onComplete: () => {
              this.positionTween = undefined
            }
          })
          .pause()
      }
      this.pathfinder.position.copy(new THREE.Vector3())
    })
  }
}
