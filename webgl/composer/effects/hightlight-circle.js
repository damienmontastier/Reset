import { Uniform } from 'three'
import { Effect, BlendFunction } from 'postprocessing'

const fragment = `
uniform sampler2D wireframeBuffer;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = texture2D(wireframeBuffer,uv);

//   outputColor= inputColor;
}
`

export default class HighlightEffect extends Effect {
  constructor({ wireframeBuffer = null }) {
    super('HighlightEffect', fragment, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map([['wireframeBuffer', new Uniform(wireframeBuffer)]])
    })
  }
}
