import gsap from 'gsap'
import * as THREE from 'three'
import raf from '@/plugins/raf'
import useWebGL from '@/hooks/use-webgl'

export default class AnimatedWorker {
  constructor({ worker, spline, loop = true, autoplay = true, duration = 10 }) {
    this.time = 0
    this.isMovable = false
    const { clock } = useWebGL()

    this.clock = clock
    this.worker = worker
    this.spline = spline
    this.path = this.spline.path
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

    this.uuid = THREE.MathUtils.generateUUID()
    raf.add(this.uuid, this.render.bind(this), 0)
  }

  toNextPosition() {
    this.gsapPosition = gsap
      .to(this.worker.position, {
        x: this.nextPosition.x,
        y: this.nextPosition.y,
        z: this.nextPosition.z,
        duration: this.duration * 0.1,
        ease: 'power2.out',
        onComplete: () => (this.gsapPosition = undefined)
      })
      .pause()
  }

  setDirection(dir) {
    const _axis = new THREE.Vector3()

    if (dir.y > 0.99999) {
      this.worker.quaternion.set(0, 0, 0, 1)
    } else if (dir.y < -0.99999) {
      this.worker.quaternion.set(1, 0, 0, 0)
    } else {
      _axis.set(dir.z, 0, -dir.x).normalize()

      const radians = Math.acos(dir.y)

      this.worker.children[0].quaternion.setFromAxisAngle(_axis, radians)
      //   this.worker.children[0].rotation.x = 0
      //   this.worker.children[0].rotation.z = 0
    }
  }

  stop() {
    this.clock.stop()
    this.isMovable = false
  }

  start() {
    this.toNextPosition()

    this.clock.start()
    this.isMovable = true
  }

  render(deltaTime) {
    if (!this.isMovable && !this.gsapPosition) return

    this.dirWorker
      .subVectors(this.nextPosition, this.worker.position)
      .normalize()

    this.arrowHelper.setDirection(this.dirWorker)
    this.setDirection(this.dirWorker)
    // this.worker.children[0].lookAt(this.dirWorker)

    this.toNextPosition()
    this.time += this.clock.getDelta() / this.duration
    this.gsapPosition.time(deltaTime)
  }

  destroy() {
    raf.add(this.uuid)
  }

  get nextPosition() {
    const time =
      this.loop === true
        ? this.time % 1
        : Math.min(Math.max(this.time, 0.0), 1.0)

    return this.path.getPointAt(time)
  }
}
