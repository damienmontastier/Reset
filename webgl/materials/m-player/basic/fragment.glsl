precision highp float;
varying vec3 vNormalizedPosition;
uniform vec3 uColor;
uniform vec3 uThreshold;

void main() {
    float alpha = step(.5, vNormalizedPosition.y);
    gl_FragColor = vec4(uColor, alpha);
}