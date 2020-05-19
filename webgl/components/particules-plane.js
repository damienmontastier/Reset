import vertexShader from '@/webgl/materials/particules/vertex.glsl'
import fragmentShader from '@/webgl/materials/particules/fragment.glsl'

import useGUI from '@/hooks/use-gui'

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
          value: 0.05
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

    this.initGUI()
  }

  update(clock) {
    this.material.uniforms.uTime.value = clock.time * 0.25
  }

  initGUI() {
    const GUI = useGUI()
    const dotsGUI = GUI.addFolder('dots pattern')
    dotsGUI
      .add(this.material.uniforms.uDotsFrenquency, 'value')
      .min(0)
      .max(1000)
      .name('dots frequency')
    dotsGUI
      .add(this.material.uniforms.uDotsRadius, 'value')
      .min(0)
      .max(1)
      .step(0.01)
      .name('dots radius')
    dotsGUI
      .add(this.material.uniforms.uNoiseAmplitude, 'value')
      .min(0)
      .max(0.1)
      .step(0.001)
      .name('noise amplitude')
    dotsGUI
      .add(this.material.uniforms.uNoiseFrequency, 'value')
      .min(0)
      .max(20)
      .step(0.1)
      .name('noise frequency')
  }
}
