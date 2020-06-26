precision highp float;

varying float vNoiseA;
varying float vNoiseB;
varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 uColor;
uniform float uAlpha;
uniform float uAppear;

void main() {
    float alpha = step(vNoiseA,uAppear);
    gl_FragColor = vec4(uColor, alpha);

    gl_FragColor *= uAlpha;

    gl_FragColor.rgb *= vNoiseB;
}