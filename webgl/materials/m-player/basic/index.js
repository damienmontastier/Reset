import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default class PlayerMaterial extends THREE.ShaderMaterial {
  constructor({ wireframe = false, color = 0xff0000 } = {}) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uThreshold: { value: 0.0 },
        uColor: { value: new THREE.Color(color) }
      },
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      wireframe
    })
  }
}
