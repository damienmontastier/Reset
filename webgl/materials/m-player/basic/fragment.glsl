precision highp float;
varying vec3 vNormalizedPosition;
uniform vec3 uColor;
uniform float uThreshold;
varying vec3 vPosition;

void main() {
    // float alpha = step(uThreshold, vPosition.y);
    gl_FragColor = vec4(vec3(.5,.4,.9), 1.0);
}