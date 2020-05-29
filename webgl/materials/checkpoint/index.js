import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default class CheckpointMaterial extends THREE.ShaderMaterial {
  constructor({ color = 0xffffff } = {}) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: {
          value: new THREE.Color(color)
        }
      },
      side: THREE.BackSide,
      transparent: true
    })
  }
}
