// Author: Marco Gomez			| @marcogomez_ | http://mgz.me	|
// Sample Shader for ShaderLab	| http://shaderlab.mgz.me		|

precision highp float;
varying vec2 vUv;
uniform vec2 uOffset;
uniform	float uTime;
float fft = 0.1;

const float t2PI = 6.283185307180;
const float d2PI = 0.636619772368;
const float W1 = 0.333333333333; // 1/3
const float W2 = 0.666666666667; // 1/1.5
const float r = 43758.5453123;

float osc ( in float s, in float e, in float t ) {
	return ( e - s ) * 0.5 + s + sin( t ) * ( e - s ) * 0.5;
}

float r11 ( in float n ) {
    return fract( sin( n ) * r );
}

vec2 r22 ( in vec2 p ) {
    return fract( vec2( sin( p.x * 591.32 + p.y * 154.077 ),
                        cos( p.x * 391.32 + p.y * 49.077 ) ) );
}

float n11 ( in float p ) {
    float fl = floor( p );
    float fc = fract( p );
    return mix( r11( fl ), r11( fl + 1.000004 ), fc );
}

float vn ( in vec2 x ) {
	vec2 p = floor( x );
	vec2 f = fract( x );
	vec2 rs = vec2( 8.0 );
	for( int j = -1; j <= 1; j++ )
	for( int i = -1; i <= 1; i++ ) {
		vec2 b = vec2( i, j );
		vec2 r = vec2( b ) - f + r22( p + b );
		float d = max( abs( r.x ), abs( r.y ) );
		if( d < rs.x ) {
			rs.y = rs.x;
			rs.x = d;
		} else if( d < rs.y ) {
			rs.y = d;
		}
	}
	return rs.y-rs.x;
}

void main(void) {
	float t1 = uTime * 0.12;
	float t2 = uTime * 0.1428571428571429;
	float t3 = uTime * 0.2;
	float t4 = uTime * 0.3333333333333333;
	vec2 uv = vUv * 10. + uOffset;
	// uv = ( gl_FragCoord.xy * 2.0 - resolution.xy ) / min( resolution.x, resolution.y );
	vec2 uv_b = uv;
	float v = 0.;
	// uv.y += t1;
	float a = 0.7;
	float f = 1.0;
	vec2 ifft = vec2( fft, -fft ) * 0.12;
    float o = clamp( osc( -12.0, 8.0, uTime * 0.0625 ), -1.5, 0.7 );
    float ost = osc( 0.021, 0.055, uTime * 0.33 );
	for( int i = 0; i < 4; i++ ) {
		float v1 = vn( uv * f + 5.0 );
		float v2 = 0.0;
        if( i > 0 ) {
            if( i == 3 ) {
                uv *= 0.0125;
                a *= sqrt( a / f );
                v1 = mix( v1 * 1.5, v1 * 1.5 * v2, 0.6 );
            }
			float va = 0.0;
			float vb = 0.0;
			if( i == 1 ) {
				va = 1.0 - smoothstep( 0.0, ost, v1 );
				v2 = vn( uv * f * 0.1 + 8694.0 + t2 + fft * 0.1 );
				vb = 1.0 - smoothstep( 0.0, 0.1, v2 );
			} else {
				va = 1.0 - smoothstep( 0.0, 0.1, v1 );
				v2 = vn( ( uv + ifft ) * f * 0.5 + 50.0 + t3 );
                if( i == 3 ) { vb = 1.0 - smoothstep( -0.5, 0.5, v2 * 2.0 ); }
                else if( i == 1 ) { vb = 1.0 - smoothstep( 0.0, 0.001, v2 * 2.0 ); }
                else { vb = 1.0 - smoothstep( -0.1, 0.08, v2 ); }
			}
			v += a * pow( abs( va ) * ( 0.5 + vb ), 2.0 );
		}
		v1 = 1.0 - smoothstep( 0.0, 0.2, v1 );
		v2 = mix( 0.12, a * ( n11( v1 * 7.5 + 0.3 ) ), o );
		f *= 3.0;
		a *= 0.7 + abs( sin( t4 ) ) * 0.3333333333333333;
	}
	vec3 cxp = vec3( 2.0, 1.8, 1.4 ) * 1.21;
	vec3 col = vec3( pow( abs( v ), cxp.x ),
                     pow( abs( v ), cxp.y ),
                     pow( abs( v ), cxp.z ) ) * 7.2;

	gl_FragColor = vec4( col, 1.0 );
}

// ███████╗██╗  ██╗ █████╗ ██████╗ ███████╗██████╗ ██╗      █████╗ ██████╗
// ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝██╔══██╗██║     ██╔══██╗██╔══██╗
// ███████╗███████║███████║██║  ██║█████╗  ██████╔╝██║     ███████║██████╔╝
// ╚════██║██╔══██║██╔══██║██║  ██║██╔══╝  ██╔══██╗██║     ██╔══██║██╔══██╗
// ███████║██║  ██║██║  ██║██████╔╝███████╗██║  ██║███████╗██║  ██║██████╔╝
// ╚╦═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚════╦╝
//══╩═══════════════════════════╦═══════════════════════════════════╦═══╝
// Author: Marco Gomez			║ @marcogomez_ ( https://mgz.me )   ║
// Sample Shader for ShaderLab	║ https://shaderlab.mgz.me			║
//══════════════════════════════╩═══════════════════════════════════╝