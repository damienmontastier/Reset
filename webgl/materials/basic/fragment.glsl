precision highp float;

varying float vNoise;
varying vec3 vPosition;
varying vec3 vNormal;

uniform vec3 uColor;
uniform float uAlpha;
uniform float uAppear;

void main() {
    float alpha = step(vNoise,uAppear);
    gl_FragColor = vec4(uColor, alpha);

    gl_FragColor *= uAlpha;

    // gl_FragColor = vec4(vNormal, 1.0);

    // if(vNormal.g > 0.) {
    //     gl_FragColor.rgb = vec3(0.);
    // }

    // if(vNormal.r > 0.) {
    //     gl_FragColor.rgb = vec3(0.);
    // }
}