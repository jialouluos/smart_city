const BuildingSpecialEffects_vertexShader = /* glsl */`
varying vec3 v_Position;
uniform float u_High;
uniform float u_Time;
varying float v_Time;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    //!高度渐增
    if(u_Time<100.0){
        modelPosition.y = min(min(modelPosition.y,u_High + pow(u_Time,2.0)),modelPosition.y);
    }
	gl_Position = projectionMatrix * viewMatrix * modelPosition;
	v_Position = position;
	v_Time = u_Time;
}
`;
export default BuildingSpecialEffects_vertexShader;