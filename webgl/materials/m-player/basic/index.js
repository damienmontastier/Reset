import fragmentShader from './fragment.glsl'
import vertexShader from './vertex.glsl'

export default class PlayerBasicMaterial {
  constructor({ color, wireframe = false } = {}) {
    return new THREE.ShaderMaterial({
      color: 0x000000,
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: {
          value: new THREE.Color(color)
        }
      },
      transparent: true,
      depthWrite: true,
      depthTest: true,
      skinning: true,
      wireframe: true
    })
  }
}
