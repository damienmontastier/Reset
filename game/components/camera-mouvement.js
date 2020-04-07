import gsap from 'gsap'
import useGame from '@/hooks/use-game'
import useCamera from '@/hooks/use-camera'
// import useWebGL from '@/hooks/use-webgl'

export default class CameraMouvement {
  constructor({ mesh, duration }) {
    const { raf } = useGame()

    this.mesh = mesh
    this.duration = duration

    this.toNextPosition()

    raf.add('camera-animation', this.loop.bind(this), 0)
  }

  toNextPosition() {
    const { camera } = useCamera()

    this.gsapPosition = gsap
      .to(camera.position, {
        x: this.mesh.worldPosition.x,
        y: this.mesh.worldPosition.y,
        z: this.mesh.worldPosition.z,
        duration: this.duration,
        ease: 'power2.out',
        onComplete: () => (this.gsapPosition = undefined)
      })
      .pause()
  }

  loop(clock) {
    if (this.gsapPosition) {
      this.toNextPosition()
      const time = this.gsapPosition.time()
      this.gsapPosition.time(time + clock.deltaTime)
    }
  }

  destroy() {}
}
