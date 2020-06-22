varying vec3 vPosition;
varying vec2 vUv;

uniform vec2 uRatio;
uniform vec3 uColor;
uniform float uSegments;
uniform vec2 uCursor;

void main() {
  // Pick a coordinate to visualize in a grid
  vec2 coord = vPosition.xy * uSegments;
    coord = coord * uRatio;
  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
  float line = min(grid.x, grid.y);

  float alpha = 1.-distance(vUv * uRatio,uCursor * uRatio);

  // Just visualize the grid lines directly
  gl_FragColor = vec4(uColor, (1.0 - min(line, 1.0)) * alpha);

// gl_FragColor = vec4()
}