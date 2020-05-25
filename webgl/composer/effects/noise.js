import { Effect, BlendFunction } from 'postprocessing'

const fragment = `
uniform float intensity;
uniform float offset;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = inputColor - (rand(uv + offset) - 0.5) * intensity;
}
`

export default class NoiseEffect extends Effect {
  constructor({ intensity = 0.1, offset = 0 } = {}) {
    super('NoiseEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([
        ['intensity', new THREE.Uniform(intensity)],
        ['offset', new THREE.Uniform(offset)]
      ])
    })
  }
}
