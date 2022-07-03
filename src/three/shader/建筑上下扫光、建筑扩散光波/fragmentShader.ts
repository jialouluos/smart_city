
const BuildingSpecialEffects_fragmentShader = /* glsl */`
precision mediump float;
varying vec3 v_Position;
uniform float u_Time;
uniform float u_Speed;//?速度
uniform float u_Opacity;//?建筑透明度
uniform vec3 u_BuildColor;//?楼房颜色
uniform float u_ScanRegion;//?建筑扫描效果范围
uniform vec3 u_ScanColor;//?扫描带颜色
uniform float u_SpreadRegion;//?建筑扩散效果范围
uniform float u_SpreadSize;//?建筑扩散范围
uniform vec3 u_SpreadColor;//?扩散带颜色
const float PI = 3.1415926;
float mysmoothstep(float x) {
    return (x < 0.5) ? sqrt(0.5 * x) : 1.0 - sqrt(0.5 - 0.5 * x);
}
void main(){
	vec2 ori_position = vec2(0.0);//?原点
    vec2 cur_position = v_Position.xy;//?计算点
	vec3 col = u_BuildColor;//?初始为建筑颜色
    float dis = distance(ori_position,cur_position);//?计算距离
    float region = fract((u_Time + 32.0) * u_Speed) * u_SpreadSize;//?扩散范围 0~u_SpreadSize
    float spread_low_region = region - u_SpreadRegion / 2.0;//?最小值
    float spread_top_region = region + u_SpreadRegion / 2.0;//?最大值
    if(dis < spread_top_region  && dis > spread_low_region){
        //?处于该范围
        col = mix(u_SpreadColor,col,1.0-sin((spread_top_region - dis) / u_SpreadRegion * PI));
    }
    float percent  = v_Position.z/300.0;
    float scan_low_region = fract(u_Time * u_Speed) * (1.0 + mysmoothstep(percent) - percent) * (1.0 + u_ScanRegion) - u_ScanRegion; //?[-u_ScanRegion,1.0]
    float scan_top_region = scan_low_region + u_ScanRegion;//?[0.0-1.0 + u_ScanRegion]
    float y = percent ;//?[0.0,1.0]
    percent = step(percent, scan_top_region) * percent;//?低于scan_top_region不变，高于scan_top_region为0
    percent = step(scan_low_region, percent) * percent;//?高于scan_low_region不变，低于于scan_top_region为0
    float high = percent == 0.0 ? 0.0 : smoothstep(scan_low_region, scan_top_region, percent);
    col = col + u_ScanColor * high;
    gl_FragColor = vec4(col, u_Opacity);
}
`;
export default BuildingSpecialEffects_fragmentShader;