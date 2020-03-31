import { Uniform, Color } from 'three'
import { Effect, EffectAttribute, BlendFunction } from 'postprocessing'

const fragment = `
uniform sampler2D normalBuffer;
uniform float threshold;
uniform float step;
uniform vec3 outlineColor;

float sobel_intensity(in vec4 color){
	return sqrt((color.x*color.x)+(color.y*color.y)+(color.z*color.z));
}

float when_gt(float x, float y) {
  return max(sign(x - y), 0.0);
}

vec4 defferedColor(vec2 uv) {
  vec4 normalColor = texture2D(normalBuffer, uv);
  return vec4(normalColor.rgb * 0.5 + vec3(readDepth(uv)), normalColor.a);

  // return vec4(vec3(readDepth(uv)),1.);
}

void mainImage(const in vec4 inputColor, const in vec2 uv,const in float depth, out vec4 outputColor) {
  
  float stepx = step*0.001;
  float stepy = step*0.001*aspect;

  float tleft =   sobel_intensity(defferedColor(uv + vec2(-stepx,stepy)));
  float left =    sobel_intensity(defferedColor(uv + vec2(-stepx,0)));
  float bleft =   sobel_intensity(defferedColor(uv + vec2(-stepx,-stepy)));
  float top =     sobel_intensity(defferedColor(uv + vec2(0,stepy)));
  float bottom =  sobel_intensity(defferedColor( uv + vec2(0,-stepy)));
  float tright =  sobel_intensity(defferedColor( uv + vec2(stepx,stepy)));
  float right =   sobel_intensity(defferedColor( uv + vec2(stepx,0)));
  float bright =  sobel_intensity(defferedColor( uv + vec2(stepx,-stepy)));

  float x = tleft + 2.0*left + bleft - tright - 2.0*right - bright;
  float y = -tleft - 2.0*top - tright + bleft + 2.0 * bottom + bright;
  float color = sqrt((x*x) + (y*y));

  color = when_gt(color, threshold);

  vec3 outColor = (color > 0.) ? outlineColor : inputColor.rgb;

  outputColor = vec4(outColor,inputColor.a);

  // outputColor= defferedColor(uv);
}
`
/**
 * A sobel effect
 *
 * Original shader code by Jeroen Baert - jeroen.baert@cs.kuleuven.be
 * http://www.forceflow.be
 */

export default class SobelEffect extends Effect {
  /**
   * Constructs a new bokeh effect.
   *
   * @param {Object} [options] - The options.
   * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
   * @param {Number} [options.step=1] - The focus distance ratio, ranging from 0.0 to 1.0.
   */

  constructor(
    normalBuffer = null,
    {
      blendFunction = BlendFunction.NORMAL,
      step = 1,
      intensity = 1,
      outlineColor = 0x000000,
      threshold = 0.5
    } = {}
  ) {
    super('OutlineEffect', fragment, {
      blendFunction,
      // attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
      attributes: EffectAttribute.DEPTH,
      uniforms: new Map([
        ['normalBuffer', new Uniform(normalBuffer)],
        ['step', new Uniform(step)],
        ['intensity', new Uniform(intensity)],
        ['outlineColor', new Uniform(new Color(outlineColor))],
        ['threshold', new Uniform(threshold)]
      ])
    })
  }
}
