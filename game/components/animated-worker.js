// import gsap from 'gsap'
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

    if (this.autoplay) this.start()

    this.uuid = THREE.MathUtils.generateUUID()
    raf.add(this.uuid, this.render.bind(this), 0)
  }

  stop() {
    this.clock.stop()
    this.isMovable = false
  }

  start() {
    this.clock.start()
    this.isMovable = true
  }

  render() {
    if (!this.isMovable) return

    this.time += this.clock.getDelta() / this.duration

    this.worker.position.copy(this.nextPosition)

    // gsap.to(this.worker.position, {
    //   x: this.nextPosition.x,
    //   y: this.nextPosition.y,
    //   z: this.nextPosition.z,
    //   duration: 1,
    //   ease: 'power1.out'
    // })
  }

  get nextPosition() {
    const time =
      this.loop === true
        ? this.time % 1
        : Math.min(Math.max(this.time, 0.0), 1.0)

    return this.path.getPointAt(time)
  }
}
