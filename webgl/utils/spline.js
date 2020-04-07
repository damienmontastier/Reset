import * as THREE from 'three'

// TODO - add rotation
// TODO - retirer le gsap dans le render

export default class Spline {
  constructor({ spline, scale = 10 }) {
    this.time = 0
    this.isMoving = false

    this.spline = spline
    this.scale = scale

    this.points = this.spline.geometry.getAttribute('position').array
    this.vectors = this.convertPointsArrayToVector3(this.points, this.scale)
    this.path = new THREE.CatmullRomCurve3(this.vectors)
  }

  convertPointsArrayToVector3(points, scale) {
    const resultPoints = []
    for (let i = 0; i < points.length; i = i + 3) {
      const vectorPoint = new THREE.Vector3(
        points[i],
        points[i + 1],
        points[i + 2]
      )

      vectorPoint.multiplyScalar(scale)
      resultPoints.push(vectorPoint)
    }
    return resultPoints
  }
}
