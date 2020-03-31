import * as THREE from 'three'

// const vertexShader = `
//     varying vec2 vUv;
//     varying vec3 vNormal;

//     void main() {
//         vUv = uv;
//         vNormal = normal;
//         gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
//     }
// `;

// const fragmentShader = `
// float when_lt(float x, float y) {
//     return max(sign(y - x), 0.0);
// }

// vec2 when_lt(vec2 x, vec2 y) {
//     return max(sign(y - x), 0.0);
// }

// vec3 when_lt(vec3 x, vec3 y) {
//     return max(sign(y - x), 0.0);
// }

// vec4 when_lt(vec4 x, vec4 y) {
//     return max(sign(y - x), 0.0);
// }

// float when_ge(float x, float y) {
//     return 1.0 - when_lt(x, y);
//   }

//   vec2 when_ge(vec2 x, vec2 y) {
//     return 1.0 - when_lt(x, y);
//   }

//   vec3 when_ge(vec3 x, vec3 y) {
//     return 1.0 - when_lt(x, y);
//   }

//   vec4 when_ge(vec4 x, vec4 y) {
//     return 1.0 - when_lt(x, y);
//   }

//   float when_and(float a, float b) {
//     return a * b;
//   }

//   vec2 when_and(vec2 a, vec2 b) {
//     return a * b;
//   }

//   vec3 when_and(vec3 a, vec3 b) {
//     return a * b;
//   }

//   vec4 when_and(vec4 a, vec4 b) {
//     return a * b;
//   }

//   float when_gt(float x, float y) {
//     return max(sign(x - y), 0.0);
// }

// float when_eq( float x, float y ) {
//     return 1.0 - abs( sign( x - y ) );
// }

//     varying vec2 vUv;
//     varying vec3 vNormal;

//     uniform vec3 lightDirection;
//     uniform vec3 color;
//     uniform sampler2D gradientMap;

//     uniform float dotsRadius;
//     uniform float dotsFrequency;
//     uniform vec3 dotsColor;

//     uniform float hatchingFrequency;
//     uniform vec3 hatchingColor;

// float getHatchPattern(float scale) {
//     return when_eq(0.0, mod(gl_FragCoord.x + gl_FragCoord.y, scale));
// }

// float getDotPattern(float offset) {
//     return 1.0 - when_gt(mod(gl_FragCoord.x, 2.0001) + mod(gl_FragCoord.y + offset, 2.0), 1.0);
// }

//     vec3 getSketchIrradiance(const in vec3 normal, const in vec3 lightDirection) {
//         float dotNL = saturate(dot(normal, lightDirection));
//         vec3 thresholds = vec3(0.2, 0.35, 0.5);
//         float threshold1 = when_lt(dotNL, thresholds.x);
//         float threshold2 = when_and(when_lt(dotNL, thresholds.y),when_ge(dotNL, thresholds.x));
//         float threshold3 = when_and(when_lt(dotNL, thresholds.z), when_ge(dotNL, thresholds.y));
//         float threshold4 = when_ge(dotNL, thresholds.z);
//         vec3 mask1 = mix(vec3(1.0), vec3(0.,0.,0.), threshold1);
//         vec3 mask2 = mix(vec3(1.0), vec3(0.4980392156862745,0.4980392156862745,0.4980392156862745), threshold2);
//         vec3 mask3 = mix(vec3(1.0), vec3(0.6980392156862745,0.6980392156862745,0.6980392156862745), threshold3);
//         vec3 masks = mask1 * mask2 * mask3;
//         vec3 pattern1 = mix(vec3(1.0), vec3(0.6,0.6,0.6), when_and(threshold2, getHatchPattern(3.0)));
//         vec3 pattern2 = mix(vec3(1.0), vec3(0.6,0.6,0.6), when_and(threshold3, getHatchPattern(4.0)));
//         vec3 pattern3 = mix(vec3(1.0), vec3(0.6980392156862745,0.6980392156862745,0.6980392156862745), when_and(threshold4, getDotPattern(2.0)));
//         vec3 patterns = pattern1 * pattern2 * pattern3;
//         return masks * patterns;
//     }

//     void main() {
//         vec3 irradiance = getSketchIrradiance(vNormal, lightDirection);

//         // gl_FragColor = vec4(outputColor,1.0);
//         gl_FragColor = vec4(irradiance,1.);
//     }
// `;

// float getHatchPattern(float scale) {\n  return when_eq(0.0, mod(gl_FragCoord.x + gl_FragCoord.y, scale));\n}\n\n
// float getDotPattern(float offset) {\n  return 1.0 - when_gt(mod(gl_FragCoord.x, 2.0001) + mod(gl_FragCoord.y + offset, 2.0), 1.0);\n}\n\n
// vec3 getSketchIrradiance(const in DefaultMaterial material, const in vec3 normal, const in vec3 lightDirection) {
// float dotNL = saturate(dot(normal, lightDirection));
// vec3 thresholds = vec3(0.2, 0.35, 0.5);
// float threshold1 = when_lt(dotNL, thresholds.x);
// float threshold2 = when_and(when_lt(dotNL, thresholds.y),when_ge(dotNL, thresholds.x));
// float threshold3 = when_and(when_lt(dotNL, thresholds.z), when_ge(dotNL, thresholds.y))
// float threshold4 = when_ge(dotNL, thresholds.z);
// vec3 mask1 = mix(vec3(1.0), vec3(0.,0.,0.), threshold1);
// vec3 mask2 = mix(vec3(1.0), vec3(0.4980392156862745,0.4980392156862745,0.4980392156862745), threshold2);
// vec3 mask3 = mix(vec3(1.0), vec3(0.6980392156862745,0.6980392156862745,0.6980392156862745), threshold3);
// vec3 masks = mask1 * mask2 * mask3;
// vec3 pattern1 = mix(vec3(1.0), vec3(0.6,0.6,0.6), when_and(threshold2, getHatchPattern(3.0)));
// vec3 pattern2 = mix(vec3(1.0), vec3(0.6,0.6,0.6), when_and(threshold3, getHatchPattern(4.0)));
// vec3 pattern3 = mix(vec3(1.0), vec3(0.6980392156862745,0.6980392156862745,0.6980392156862745), when_and(threshold4, getDotPattern(2.0)));
// vec3 patterns = pattern1 * pattern2 * pattern3;
// return masks * patterns;
// }
// vec3 getDirectSpecular(const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess) {\n  vec3 halfDir = normalize(incidentLight.direction + geometry.viewDir);\n  float dotNH = dot(geometry.normal, halfDir);\n\n  float spec = max(0.0, pow(abs(dotNH), shininess));\n  return mix(0.0, 1.0, step(0.5, spec)) * specularColor;\n}\n\nvoid indirect(const in AmbientIrradiance ambient, const in DefaultMaterial material, inout ReflectedLight reflectedLight) {\n  vec3 irradiance = ambient.color * material.diffuseColor;\n\n  reflectedLight.indirectDiffuse = irradiance;\n}\n\nvoid direct(const in IncidentLight directLight, const in GeometricContext geometry, const in DefaultMaterial material, inout ReflectedLight reflectedLight) {\n  vec3 irradiance = getSketchIrradiance(material, geometry.normal, directLight.direction) * directLight.color;\n\n  reflectedLight.directDiffuse += irradiance * material.diffuseColor;\n  reflectedLight.directSpecular += irradiance * getDirectSpecular(directLight, geometry, material.specularColor, material.specularShininess) * material.specularStrength;\n}\n"

let fragmentShader = THREE.ShaderLib.toon.fragmentShader
fragmentShader = fragmentShader.replace(
  '#include <common>',
  `
    float when_lt(float x, float y) {
        return max(sign(y - x), 0.0);
    }

    vec2 when_lt(vec2 x, vec2 y) {
        return max(sign(y - x), 0.0);
    }

    vec3 when_lt(vec3 x, vec3 y) {
        return max(sign(y - x), 0.0);
    }

    vec4 when_lt(vec4 x, vec4 y) {
        return max(sign(y - x), 0.0);
    }

    float when_ge(float x, float y) {
        return 1.0 - when_lt(x, y);
    }

    vec2 when_ge(vec2 x, vec2 y) {
        return 1.0 - when_lt(x, y);
    }

    vec3 when_ge(vec3 x, vec3 y) {
        return 1.0 - when_lt(x, y);
    }

    vec4 when_ge(vec4 x, vec4 y) {
        return 1.0 - when_lt(x, y);
    }

    float when_and(float a, float b) {
        return a * b;
    }

    vec2 when_and(vec2 a, vec2 b) {
        return a * b;
    }

    vec3 when_and(vec3 a, vec3 b) {
        return a * b;
    }

    vec4 when_and(vec4 a, vec4 b) {
        return a * b;
    }

    float when_gt(float x, float y) {
        return max(sign(x - y), 0.0);
    }

    float when_eq( float x, float y ) {
        return 1.0 - abs( sign( x - y ) );
    }

    struct AmbientIrradiance {
        vec3 color;
    };

    struct DefaultMaterial {
        vec3 diffuseColor;
        vec3 specularColor;
        float specularShininess;
        float specularStrength;
    };

    // struct ReflectedLight {
    //     vec3 directDiffuse;
    //     vec3 indirectDiffuse;
    //     vec3 directSpecular;
    // };

    // struct GeometricContext {
    //     vec3 position;
    //     vec3 normal;
    //     vec3 viewDir;
    // };

    // struct IncidentLight {
    //     vec3 color;
    //     vec3 direction;
    //     bool visible;
    // };

    float getHatchPattern(float scale) {
        return when_eq(0.0, mod(gl_FragCoord.x + gl_FragCoord.y, scale));
    }

    float getDotPattern(float offset) {
        return 1.0 - when_gt(mod(gl_FragCoord.x, 2.0001) + mod(gl_FragCoord.y + offset, 2.0), 1.0);
    }

    vec3 getDirectSpecular( vec3 direction, vec3 viewDir, vec3 normal, const in vec3 specularColor, const in float shininess) {
        vec3 halfDir = normalize(direction + viewDir);
        float dotNH = dot(normal, halfDir);
        float spec = max(0.0, pow(abs(dotNH), shininess));
        return mix(0.0, 1.0, step(0.5, spec)) * specularColor;
    }

    

    vec3 getSketchIrradiance(const in vec3 normal, const in vec3 lightDirection) {
        float dotNL = saturate(dot(normal, lightDirection));
        vec3 thresholds = vec3(0.2, 0.35, 0.5);
        float threshold1 = when_lt(dotNL, thresholds.x);
        float threshold2 = when_and(when_lt(dotNL, thresholds.y),when_ge(dotNL, thresholds.x));
        float threshold3 = when_and(when_lt(dotNL, thresholds.z), when_ge(dotNL, thresholds.y));
        float threshold4 = when_ge(dotNL, thresholds.z);
        vec3 mask1 = mix(vec3(1.0), vec3(0.,0.,0.), threshold1);
        vec3 mask2 = mix(vec3(1.0), vec3(0.4980392156862745,0.4980392156862745,0.4980392156862745), threshold2);
        vec3 mask3 = mix(vec3(1.0), vec3(0.6980392156862745,0.6980392156862745,0.6980392156862745), threshold3);
        vec3 masks = mask1 * mask2 * mask3;
        vec3 pattern1 = mix(vec3(1.0), vec3(0.6,0.6,0.6), when_and(threshold2, getHatchPattern(3.0)));
        vec3 pattern2 = mix(vec3(1.0), vec3(0.6,0.6,0.6), when_and(threshold3, getHatchPattern(4.0)));
        vec3 pattern3 = mix(vec3(1.0), vec3(0.6980392156862745,0.6980392156862745,0.6980392156862745), when_and(threshold4, getDotPattern(2.0)));
        vec3 patterns = pattern1 * pattern2 * pattern3;
        return masks * patterns;
    }

    // void indirect(const in AmbientIrradiance ambient, const in DefaultMaterial material, inout ReflectedLight reflectedLight) {
    //     vec3 irradiance = ambient.color * material.diffuseColor;
    //     reflectedLight.indirectDiffuse = irradiance;
    // }

    // void direct(const in IncidentLight directLight, const in GeometricContext geometry, const in DefaultMaterial material, inout ReflectedLight reflectedLight) {
    //     vec3 irradiance = getSketchIrradiance(geometry.normal, directLight.direction) * directLight.color;
    //     reflectedLight.directDiffuse += irradiance * material.diffuseColor;
    //     reflectedLight.directSpecular += irradiance * getDirectSpecular(directLight, geometry, material.specularColor, material.specularShininess) * material.specularStrength;
    // }

    #include <common>
    `
)

fragmentShader = fragmentShader.replace(
  'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
  `
    vec3 vIrradiance = getSketchIrradiance(geometry.normal, directLight.direction)  * directLight.color;


    // reflectedLight.indirectDiffuse = ambient.color * diffuse;
    reflectedLight.directDiffuse += vIrradiance * diffuse;
    reflectedLight.directSpecular = vIrradiance * getDirectSpecular(directLight.direction, geometry.viewDir, geometry.normal, specular, shininess);
    outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + totalEmissiveRadiance;


    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
    // gl_FragColor = vec4( reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular, diffuseColor.a );
    `
)

// struct AmbientIrradiance {
//     vec3 color;
// };

// vec3 getDirectSpecular(const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess) {
//     vec3 halfDir = normalize(incidentLight.direction + geometry.viewDir);
//     float dotNH = dot(geometry.normal, halfDir);
//     float spec = max(0.0, pow(abs(dotNH), shininess));
//     return mix(0.0, 1.0, step(0.5, spec)) * specularColor;
// }

// void indirect(const in AmbientIrradiance ambient, const in DefaultMaterial material, inout ReflectedLight reflectedLight) {
//     vec3 irradiance = ambient.color * material.diffuseColor;
//     reflectedLight.indirectDiffuse = irradiance;
// }

// void direct(const in IncidentLight directLight, const in GeometricContext geometry, const in DefaultMaterial material, inout ReflectedLight reflectedLight) {
//     vec3 irradiance = getSketchIrradiance(material, geometry.normal, directLight.direction) * directLight.color;
//     reflectedLight.directDiffuse += irradiance * material.diffuseColor;
//     reflectedLight.directSpecular += irradiance * getDirectSpecular(directLight, geometry, material.specularColor, material.specularShininess) * material.specularStrength;
// }"

// indirect(ambient, material, reflectedLight);
// direct(directLight, geometry, material, reflectedLight);

// vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + totalEmissiveRadiance;

// TODO pass uniforms
// deal with steps

export default class ToonMaterial extends THREE.ShaderMaterial {
  constructor({ color = 0xffffff, emissive = 0x333333 } = {}) {
    super({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib.toon.uniforms,
        {
          diffuse: { value: new THREE.Color(color) },
          emissive: { value: new THREE.Color(emissive) }
        }
      ]),
      vertexShader: THREE.ShaderLib.toon.vertexShader,
      fragmentShader,
      lights: true,
      transparent: true
    })

    // console.log({
    //   ...this.uniforms,
    //   ...{ diffuse: { value: new THREE.Color(color) } }
    // });

    // this.uniforms.diffuse.value = new THREE.Color(color);
    // this.uniforms.emissive.value = new THREE.Color(emissive);

    // console.log(color);

    this.color = this.uniforms.diffuse.value
    this.emissive = this.uniforms.emissive.value
  }
}
