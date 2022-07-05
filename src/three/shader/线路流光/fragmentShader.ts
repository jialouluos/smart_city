
const CityFlyLine_fragmentShader = /*glsl*/`
precision mediump float;
varying float v_Percent;//自定义百分比
varying float v_PercentageSize;//点大小占比
uniform vec3 u_Color;
void main(){
	float dis = distance(gl_PointCoord, vec2(0.5, 0.5));
	if (dis>0.5){
		discard;
	}
	if(v_PercentageSize<0.2){
		discard;
	}else{
		gl_FragColor = vec4(u_Color, 1.0);
	}
}
`
export default CityFlyLine_fragmentShader;