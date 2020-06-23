varying vec3 vNormalizedPosition;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vNormalizedPosition = normalize(position) + 0.5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}