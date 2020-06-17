varying vec3 vNormalizedPosition;

void main() {
  vNormalizedPosition = normalize(position) + 0.5;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}