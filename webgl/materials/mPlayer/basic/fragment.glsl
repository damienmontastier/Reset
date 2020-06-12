precision highp float;


void main() {
    float alpha = step(vNoise,uAppear);
    gl_FragColor = vec4(uColor, alpha);

    gl_FragColor *= uAlpha;
}