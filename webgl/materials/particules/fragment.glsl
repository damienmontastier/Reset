precision highp float;

varying vec2 vUv;

uniform float uDotsFrenquency;
uniform float uDotsRadius;

void main() {
    // Distance to nearest point in a grid of
    // (frequency x frequency) points over the unit square
    // float frequency = 100.0;
    vec2 nearest = 2.0*fract(uDotsFrenquency * vUv) - 1.0;
    float dist = length(nearest);
    // float radius = 0.1;
    vec3 white = vec3(1.0, 1.0, 1.0);
    vec3 black = vec3(0.0, 0.0, 0.0);
    float alpha = mix(1.0, 0.0, step(uDotsRadius, dist));

    vec3 color = vec3(1.0);
    gl_FragColor = vec4(color, alpha);
}