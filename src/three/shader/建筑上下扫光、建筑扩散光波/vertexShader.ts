const BuildingSpecialEffects_vertexShader = /* glsl */`
varying vec3 v_Position;
void main(){
    vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
    gl_Position = projectionMatrix * mvPosition;
	v_Position = position;
}
`;
export default BuildingSpecialEffects_vertexShader;