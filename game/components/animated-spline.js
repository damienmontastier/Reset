import gsap from 'gsap'
import * as THREE from 'three'
import useGame from '@/hooks/use-game'

export default class AnimatedWorker {
  constructor({ worker, spline, loop = true, autoplay = true, duration = 10 }) {
    this.time = 0
    this.isMovable = false
    this.worker = worker
    this.spline = spline
    this.path = this.spline.vectors
    this.loop = loop
    this.duration = duration
    this.autoplay = autoplay

    this.dirWorker = this.nextPosition.normalize()
    const origin = new THREE.Vector3(0, 0.5, 0)
    this.arrowHelper = new THREE.ArrowHelper(
      this.dirWorker,
      origin,
      1,
      0xffff00
    )
    this.arrowHelper.scale.multiplyScalar(2)
    this.worker.add(this.arrowHelper)

    if (this.autoplay) this.start()
  }

  toNextPosition() {
    const dist = this.worker.position.distanceTo(this.nextPosition)

    console.log(dist)

    this.gsapPosition = gsap
      .to(this.worker.position, {
        x: this.nextPosition.x,
        y: this.nextPosition.y,
        z: this.nextPosition.z,
        duration: 0.1,
        onComplete: () => (this.gsapPosition = undefined)
      })
      .pause()
  }

  get nextPosition() {
    const time =
      this.loop === true
        ? this.time % 1
        : Math.min(Math.max(this.time, 0.0), 1.0)

    const normalize = Math.floor((this.path.length * (time * 100)) / 100)

    return this.path[normalize]
  }

  stop() {
    this.pause = true
  }

  start() {
    this.pause = false
  }

  set pause(bool) {
    const { raf } = useGame()

    if (bool) {
      this.isMovable = !bool
      raf.pause = bool
    } else {
      this.toNextPosition()
      raf.pause = bool
      this.isMovable = !bool
    }
  }

  render(clock) {
    if (!this.isMovable) return

    this.dirWorker
      .subVectors(this.nextPosition, this.worker.position)
      .normalize()

    this.arrowHelper.setDirection(this.dirWorker)

    // this.setDirection({
    //   model: this.worker.children[0],
    //   direction: this.dirWorker
    // })

    if (this.gsapPosition) {
      this.toNextPosition()
      this.time += clock.deltaTime / this.duration
      this.gsapPosition.time(clock.deltaTime)
    }
  }

  setDirection({ model, direction }) {
    const _axis = new THREE.Vector3()

    if (direction.y > 0.99999) {
      model.quaternion.set(0, 0, 0, 1)
    } else if (direction.y < -0.99999) {
      model.quaternion.set(1, 0, 0, 0)
    } else {
      _axis.set(direction.z, 0, -direction.x).normalize()

      const radians = Math.acos(direction.y)

      model.quaternion.setFromAxisAngle(_axis, radians)
      //   model.rotation.x = 0
      //   model.rotation.z = 0
    }
  }

  destroy() {}
}
