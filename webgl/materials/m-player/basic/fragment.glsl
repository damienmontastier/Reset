precision highp float;
varying vec3 vNormalizedPosition;
uniform vec3 uColor;
uniform float uThreshold;

void main() {
    float alpha = step(uThreshold, vNormalizedPosition.y);
    gl_FragColor = vec4(uColor, alpha);
}