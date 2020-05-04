import events from '@/plugins/events'

// import vertexShader from './vertex.glsl'
// import fragmentShader from './fragment.glsl'
let vertexShader = THREE.ShaderLib.toon.vertexShader
let fragmentShader = THREE.ShaderLib.toon.fragmentShader

vertexShader = vertexShader.replace(
  '#define TOON',
  `
  #define TOON
    varying vec3 vPosition;
  `
)

vertexShader = vertexShader.replace(
  'void main() {',
  `
  void main() {
    vPosition = position;
  `
)

fragmentShader = fragmentShader.replace(
  '#define TOON',
  `
  #define TOON
    varying vec3 vPosition;
    uniform float uDistance;
  `
)

fragmentShader = fragmentShader.replace(
  'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
  `
  gl_FragColor = vec4( outgoingLight, diffuseColor.a );

    vec3 center = vec3(0.);

    float distanceToCenter = distance(center,vPosition);
    gl_FragColor.a = step(distanceToCenter,uDistance);
  `
)

export default class DistanceMaterial extends THREE.ShaderMaterial {
  constructor({ uDistance = 5.5 } = {}) {
    super({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib.toon.uniforms,
        {
          uDistance: { value: uDistance }
        }
      ]),
      vertexShader,
      fragmentShader,
      lights: true,
      side: THREE.DoubleSide,
      transparent: true
    })

    events.on('VISIBLE_DISTANCE', (distance) => {
      this.uniforms.uDistance.value = distance
    })
  }
}
