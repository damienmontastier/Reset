import vertexShader from '@/webgl/materials/particules/vertex.glsl'
import fragmentShader from '@/webgl/materials/particules/fragment.glsl'

export default class PatriculesPlane extends THREE.Object3D {
  constructor() {
    super()
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100)

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        },
        uNoiseAmplitude: {
          value: 0.0025
        },
        uNoiseFrequency: {
          value: 10
        },
        uDotsFrenquency: {
          value: 100
        },
        uDotsRadius: {
          value: 0.1
        }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      extensions: {
        derivatives: true
      }
    })
    // this.mesh = new THREE.Points(this.geometry, this.material)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.add(this.mesh)
  }

  update(clock) {
    this.material.uniforms.uTime.value = clock.time * 0.25
  }
}
