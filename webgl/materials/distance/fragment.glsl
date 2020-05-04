precision highp float;

varying vec2 vUv;
varying vec3 vWorldPosition;

vec3 center = vec3(0.);

void main() {
  float distanceToCenter = distance(center,vWorldPosition);
  gl_FragColor = vec4(1.);
  if(distanceToCenter > 5.5) {
      gl_FragColor.a = 0.;
  }
}