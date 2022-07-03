const WaterWave_vertexShader = /* glsl */`
#define STANDARD

varying vec3 vViewPosition;
uniform float u_Time;
#ifdef USE_TRANSMISSION

	varying vec3 vWorldPosition;

#endif

#include <common>
#include <uv_pars_vertex>
#include <uv2_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

	#include <uv_vertex>
	#include <uv2_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>

	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>

	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
			float x = position.x;
            float y = position.z;
            float sx = 0.0;
            float sy = 0.0;
            float sz = 0.0;
            float ti = 0.0;
            float index = 1.0;
            vec2 dir;//水波方向
            for(int i = 0;i<3;i++){
                ti = ti + 0.0005;
                index +=1.0;
                if(mod(index,2.0)==0.0){
                    dir = vec2(1.0,ti);
                }else{
                    dir = vec2(-1.0,ti);
                }
                float l1 = 2.0 * PI / (0.5 + ti);//波长
                float s1 = 20.0 * 2.0 / l1;//速度
                float x1 = 1.0 * dir.x * sin(dot(normalize(dir),vec2(x,y)) * l1 + u_Time * s1);
                float y1 = 1.0 * dir.y * sin(dot(normalize(dir),vec2(x,y)) * l1 + u_Time * s1);
                float z1 = 1.0 * sin(dot(normalize(dir),vec2(x,y)) * l1 + u_Time * s1);
                sx +=x1;
                sy +=y1;
                sz +=z1;
            }
            sx = x + sx;
            sy = y + sy;
// mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xz,sin(sz) * 2.0,1.0);
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

	vViewPosition = - mvPosition.xyz;

	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
    
#ifdef USE_TRANSMISSION

	vWorldPosition = worldPosition.xyz;

#endif
}
`;

export default WaterWave_vertexShader
