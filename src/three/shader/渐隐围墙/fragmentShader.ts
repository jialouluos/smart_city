const RecedingEnclosure_fragmentShader = /* glsl */`
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;

varying vec3 vLightFront;
varying vec3 vIndirectFront;

#ifdef DOUBLE_SIDED
	varying vec3 vLightBack;
	varying vec3 vIndirectBack;
#endif

varying vec2 v_Uv;
uniform float u_scale;
uniform float u_a;
uniform float u_b;
uniform float u_n;
uniform float u_Time;
uniform float u_Speed;
uniform float u_animateFlag;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <fog_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
float doubleOddPolynomialSeat (float x, float a, float b, float n){

float epsilon = 0.00001;
float min_param_a = 0.0 + epsilon;
float max_param_a = 1.0 - epsilon;
float min_param_b = 0.0;
float max_param_b = 1.0;
float na = min(max_param_a, max(min_param_a, a));  
float nb = min(max_param_b, max(min_param_b, b)); 

float p = 2.0*n + 1.0;
float y = 0.0;
if (x <= na){
  y = nb - nb*pow(1.0-x/na, p);
} else {
  y = nb + (1.0-nb)*pow((x-na)/(1.0-na), p);
}
return y;
}
void main() {
	//self_code
	float alpha = 1.0 - v_Uv.y;
	if(u_animateFlag>0.5){
		alpha = doubleOddPolynomialSeat(alpha,u_a,u_b, u_n - abs(fract(u_Time * u_Speed) - 0.5)  + 0.25 );
	}
	else{
		alpha = doubleOddPolynomialSeat(alpha,u_a,u_b,u_n);
	}
	
	alpha = pow(alpha,u_scale);
	//
	#include <clipping_planes_fragment>
	
	vec4 diffuseColor = vec4( diffuse, opacity );
	
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <specularmap_fragment>
	#include <emissivemap_fragment>

	// accumulation

	#ifdef DOUBLE_SIDED

		reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;

	#else

		reflectedLight.indirectDiffuse += vIndirectFront;

	#endif

	#include <lightmap_fragment>

	reflectedLight.indirectDiffuse *= BRDF_Lambert( diffuseColor.rgb );

	#ifdef DOUBLE_SIDED

		reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;

	#else

		reflectedLight.directDiffuse = vLightFront;

	#endif

	reflectedLight.directDiffuse *= BRDF_Lambert( diffuseColor.rgb ) * getShadowMask();

	// modulation

	#include <aomap_fragment>

	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>

	#ifdef OPAQUE
	diffuseColor.a = 1.0;
	#endif
	// https://github.com/mrdoob/three.js/pull/22425
	#ifdef USE_TRANSMISSION
	diffuseColor.a *= transmissionAlpha + 0.1;
	#endif
	gl_FragColor = vec4( outgoingLight, diffuseColor.a * alpha  );
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}
`;
export default RecedingEnclosure_fragmentShader