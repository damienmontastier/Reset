const vertexDeclaration = `
#define STANDARD
varying vec3 vPosition;
varying vec3 vNormalizedPosition;
`
const vertexMain = `
void main() {
  vPosition = position;
  vNormalizedPosition = normalize(position) + 0.5;
`
let vertexShader = THREE.ShaderLib.standard.vertexShader
vertexShader = vertexShader.replace('#define STANDARD', vertexDeclaration)
vertexShader = vertexShader.replace('void main() {', vertexMain)

const fragDeclaration = `
uniform vec3 diffuse;
uniform float uThreshold;
varying vec3 vNormalizedPosition;
varying vec3 vPosition;
`

const fragMain = `
float alpha = step(uThreshold, vNormalizedPosition.y);
gl_FragColor = vec4( outgoingLight, alpha );
`

let fragmentShader = THREE.ShaderLib.standard.fragmentShader
fragmentShader = fragmentShader.replace(
  'uniform vec3 diffuse;',
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
    diffuse = 0xff0000
  } = {}) {
    super({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib.standard.uniforms,
        {
          uThreshold: { value: 0.9 },
          diffuse: { value: new THREE.Color(diffuse) }
        }
      ]),
      vertexShader,
      fragmentShader,
      lights: true,
      skinning: true,
      transparent: true,
      wireframe,
      flatShading
    })
  }
}
