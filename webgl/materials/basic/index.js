import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default class BasicMaterial extends THREE.ShaderMaterial {
  constructor({ color } = {}) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: {
          value: new THREE.Color(color)
        },
        uAppear: {
          value: 1
        },
        uAlpha: {
          value: 1
        },
        uNoiseFrequency: {
          value: 1000
        }
      },
      transparent: true,
      depthWrite: true,
      depthTest: true
    })
  }
}
