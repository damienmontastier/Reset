import * as THREE from 'three'
import raf from '@/plugins/raf'

// TODO - add duration
// TODO - add rotation

export default class Spline {
  constructor({ spline, loop = true, autoplay = true }) {
    this.spline = spline

    this.time = 0
    this.isMoving = false
    this.loop = loop
    this.autoplay = autoplay

    if (this.autoplay) this.start()

    this.uuid = THREE.MathUtils.generateUUID()

    this.points = spline.geometry.getAttribute('position').array
    this.vectors = this.convertPointsArrayToVector(this.points, 5)
    this.path = new THREE.CatmullRomCurve3(this.vectors)

    raf.add(this.uuid, this.render.bind(this), 0)
  }

  convertPointsArrayToVector(points, scale) {
    const resultPoints = []
    for (let i = 0; i < points.length; i = i + 3) {
      const vectorPoint = new THREE.Vector3(
        points[i] * scale,
        points[i + 1] * scale,
        points[i + 2] * scale
      )
      resultPoints.push(vectorPoint)
    }
    return resultPoints
  }

  stop() {
    this.isMoving = false
  }

  start() {
    this.isMoving = true
  }

  render() {
    if (!this.path) return

    if (this.isMoving) this.time += 0.00095
  }

  get position() {
    const time =
      this.loop === true
        ? this.time % 1
        : Math.min(Math.max(this.time, 0.0), 1.0)

    return this.path.getPointAt(time)
  }
}
