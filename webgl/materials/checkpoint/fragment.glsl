precision highp float;

varying vec3 vNormalizedPosition;

uniform vec3 uColor;
uniform float uAlpha;

void main() {
    float alpha = 0.5 - vNormalizedPosition.y;
    // float alpha = (p - 0.25) * 2.;

    gl_FragColor = vec4(uColor, alpha);
}