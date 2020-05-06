import vertexShader from '@/webgl/materials/particules/vertex.glsl'
import fragmentShader from '@/webgl/materials/particules/fragment.glsl'

export default class PatriculesPlane extends THREE.Object3D {
  constructor() {
    super()
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100)
    this.material = new THREE.PointsMaterial({ color: 0xffffff })
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uAmplitude: {
          value: 0.005
        },
        uFrequency: {
          value: 10
        }
      },
      vertexShader,
      fragmentShader,
      transparent: true
    })
    this.mesh = new THREE.Points(this.geometry, this.material)
    this.add(this.mesh)
  }

  update(clock) {
    this.material.uniforms.uTime.value = clock.time * 0.25
  }
}
