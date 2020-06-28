const vertexDeclaration = `
#include <common>
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
  vNormalizedPosition.y = map(vNormalizedPosition.y, 0.5, 1.5, 0., 1.);
`
let vertexShader = THREE.ShaderLib.basic.vertexShader
vertexShader = vertexShader.replace('#include <common>', vertexDeclaration)
vertexShader = vertexShader.replace('void main() {', vertexMain)

const fragDeclaration = `
uniform vec3 diffuse;
uniform float uThreshold;
uniform float uDirection;
varying vec3 vNormalizedPosition;
varying vec3 vPosition;
`

const fragMain = `
float alpha;
if(uDirection != 1.0){
  alpha = step(vPosition.y, uThreshold);
} else {
  alpha = step(uThreshold, vPosition.y);
}
gl_FragColor = vec4( outgoingLight, alpha *0.25 );
`

let fragmentShader = THREE.ShaderLib.basic.fragmentShader
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
        THREE.ShaderLib.basic.uniforms,
        {
          uThreshold: { value: 1.5 },
          uDirection: { value: 0.0 },
          diffuse: { value: new THREE.Color(diffuse) }
        }
      ]),
      vertexShader,
      fragmentShader,
      skinning: true,
      transparent: true,
      wireframe,
      depthWrite: false,
      depthTest: true
    })
  }
}
