
const CityStreamLine_fragmentShader = /*glsl*/`
precision mediump float;
uniform vec3 u_BackColor;//背景颜色
varying float v_Percent;//自定义百分比
varying float v_PercentageSize;//点大小占比
varying float v_Flag;
uniform vec3 u_Color;
void main(){
	float dis = distance(gl_PointCoord, vec2(0.5, 0.5));
	if (dis>0.5){
		discard;
	}
	if(v_Flag==0.0){
		gl_FragColor = vec4(u_BackColor, 1.0);
	}else {
		if(v_PercentageSize<0.2){
			if(v_Flag==0.2){
				gl_FragColor = vec4(u_BackColor, 1.0) ;
			}else{
				discard;
			}
		}else{
			gl_FragColor = vec4(u_Color, 1.0);
		}
	}
}
`
export default CityStreamLine_fragmentShader;