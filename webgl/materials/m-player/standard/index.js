const vertexDeclaration = `
#define STANDARD
varying vec3 vPosition;
varying vec3 vNormalizedPosition;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}
`
const vertexMain = `
void main() {
  vPosition = position;
  vNormalizedPosition = normalize(position) + 0.5;
  // vNormalizedPosition.y = map(vNormalizedPosition.y, 0., 1.5, 0., 1.);
`
let vertexShader = THREE.ShaderLib.standard.vertexShader
vertexShader = vertexShader.replace('#define STANDARD', vertexDeclaration)
vertexShader = vertexShader.replace('void main() {', vertexMain)

const fragDeclaration = `
uniform vec3 emissive;
uniform float uThreshold;
varying vec3 vNormalizedPosition;
varying vec3 vPosition;
`

const fragMain = `
float alpha = smoothstep(uThreshold, uThreshold  - .1, vPosition.y);
gl_FragColor = vec4(outgoingLight, alpha);
`

let fragmentShader = THREE.ShaderLib.standard.fragmentShader
fragmentShader = fragmentShader.replace(
  'uniform vec3 emissive;',
  fragDeclaration
)
fragmentShader = fragmentShader.replace(
  'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
  fragMain
)

export default class PlayerMaterial extends THREE.ShaderMaterial {
  constructor({
    wireframe = false,
    flatShading = false,
    emissive = 0xff0000
  } = {}) {
    super({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib.standard.uniforms,
        {
          uThreshold: { value: 1.5 },
          emissive: { value: new THREE.Color(emissive) }
        }
      ]),
      vertexShader,
      fragmentShader,
      lights: true,
      skinning: true,
      transparent: true,
      wireframe,
      flatShading,
      depthWrite: true,
      depthTest: true
    })
  }
}
