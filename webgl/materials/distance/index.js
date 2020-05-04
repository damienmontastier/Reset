import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export default class DistanceMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {},
      vertexShader,
      fragmentShader,
      transparent: true
    })
  }
}
