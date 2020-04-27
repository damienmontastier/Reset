import gsap from 'gsap'
import useCamera from '@/hooks/use-camera'

export default class CameraMouvement {
  constructor({ mesh, duration }) {
    this.mesh = mesh
    this.duration = duration

    this.goToNextPosition()

    // document.addEventListener('mousedown', () => {
    //   raf.pause = true
    // })
    // document.addEventListener('mouseup', () => {
    //   raf.pause = false
    // })
  }

  goToNextPosition() {
    const { camera } = useCamera()

    this.gsapPosition = gsap.to(camera.position, {
      x: this.mesh.worldPosition.x,
      y: this.mesh.worldPosition.y,
      z: this.mesh.worldPosition.z,
      duration: this.duration,
      ease: 'power2.out',
      onComplete: () => (this.gsapPosition = undefined)
    })
  }

  loop() {
    this.goToNextPosition()
  }

  destroy() {}
}
