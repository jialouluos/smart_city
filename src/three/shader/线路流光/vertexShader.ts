const CityFlyLine_vertexShader = /*glsl */`
attribute float a_Percent;
varying float v_PercentageSize;
uniform float u_Time;
uniform float u_Flag;
uniform float u_Number;
uniform float u_Length;
uniform float u_Size;
uniform float u_Speed;
void main(){
	vec4 Mvposition = modelViewMatrix * vec4(position, 1.0);
	gl_Position = projectionMatrix * Mvposition;
	float l = clamp(1.0 - u_Length, 0.0, 1.0);//空白部分的占比
	gl_PointSize = clamp(
		fract(
			(a_Percent + l - (u_Time * u_Speed))* u_Number) - l,//这里减去l表示将点的大小限制在0 - (1-l)之间，可以理解为用空白占比来表示点的大小，将点大小在l之下的点大小都设置为0
				0.0, 1.0)* (1./u_Length)*u_Size ; //fract之后值的范围为 0 ~(1-l) ,(1-l)也是u_Length的值,这里乘(1./u_Length)是为了消除影响，便于得到真实点大小
	v_PercentageSize = gl_PointSize / u_Size;//点大小占比 gl_PointSize的值必存在于 0~u_Size之间
}`
export default CityFlyLine_vertexShader;