precision highp float;

varying vec2 vUv;
uniform float uDotsFrenquency;
uniform float uDotsRadius;
uniform vec2 uOffset;
uniform vec3 uColor;

vec2 rotateUV(vec2 uv, float rotation)
{
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

void main() {
    // Distance to nearest point in a grid of
    // (frequency x frequency) points over the unit square
    // float frequency = 100.0;
    vec2 nearest = 2.0*fract(uDotsFrenquency * (rotateUV(vUv + uOffset,0.785398) )) - 1.0;
    float dist = length(nearest);
    // float radius = 0.1;
    vec3 white = vec3(1.0, 1.0, 1.0);
    vec3 black = vec3(0.0, 0.0, 0.0);
    float alpha = mix(1.0, 0.0, step(uDotsRadius, dist));

    gl_FragColor = vec4(uColor, alpha);
}