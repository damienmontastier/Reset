import { Uniform, Color } from 'three'
import { Effect, BlendFunction } from 'postprocessing'

const fragment = `
uniform sampler2D normalBuffer;
uniform float step;
uniform vec3 outlineColor;

float intensity(in vec4 color){
	return sqrt((color.x*color.x)+(color.y*color.y)+(color.z*color.z));
}

vec3 sobel(sampler2D inputBuffer, float stepx, float stepy, vec2 uv){
	// get samples around pixel
    float tleft = intensity(texture2D(inputBuffer,uv + vec2(-stepx,stepy)));
    float left = intensity(texture2D(inputBuffer,uv + vec2(-stepx,0)));
    float bleft = intensity(texture2D(inputBuffer,uv + vec2(-stepx,-stepy)));
    float top = intensity(texture2D(inputBuffer,uv + vec2(0,stepy)));
    float bottom = intensity(texture2D(inputBuffer,uv + vec2(0,-stepy)));
    float tright = intensity(texture2D(inputBuffer,uv + vec2(stepx,stepy)));
    float right = intensity(texture2D(inputBuffer,uv + vec2(stepx,0)));
    float bright = intensity(texture2D(inputBuffer,uv + vec2(stepx,-stepy)));
 
	// Sobel masks (see http://en.wikipedia.org/wiki/Sobel_operator)
	//        1 0 -1     -1 -2 -1
	//    X = 2 0 -2  Y = 0  0  0
	//        1 0 -1      1  2  1
	
	// You could also use Scharr operator:
	//        3 0 -3        3 10   3
	//    X = 10 0 -10  Y = 0  0   0
	//        3 0 -3        -3 -10 -3
 
    float x = tleft + 2.0*left + bleft - tright - 2.0*right - bright;
    float y = -tleft - 2.0*top - tright + bleft + 2.0 * bottom + bright;
    float color = sqrt((x*x) + (y*y));
    return vec3(color,color,color);
 }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = inputColor;
  vec3 outlineMask = sobel(normalBuffer, step/ resolution.x, step/resolution.y, uv);
  outlineMask *= 100.;

  outputColor.rgb = (outlineMask.r > 0.001) ? outlineColor : inputColor.rgb;

  // outputColor.rgb = outlineMask;
}
`
// https://www.shadertoy.com/view/Xdf3Rf

export default class SobelEffect extends Effect {
  constructor(
    normalBuffer = null,
    {
      blendFunction = BlendFunction.NORMAL,
      step = 1,
      outlineColor = 0x000000
    } = {}
  ) {
    super('OutlineEffect', fragment, {
      blendFunction,
      // attributes: EffectAttribute.CONVOLUTION | EffectAttribute.DEPTH,
      // attributes: EffectAttribute.DEPTH,
      uniforms: new Map([
        ['normalBuffer', new Uniform(normalBuffer)],
        ['step', new Uniform(step)],
        ['outlineColor', new Uniform(new Color(outlineColor))]
      ])
    })
  }
}
