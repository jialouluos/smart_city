import RecedingEnclosure_vertexShader from '../shader/渐隐围墙/vertexShader'
import RecedingEnclosure_fragmentShader from '../shader/渐隐围墙/fragmentShader'
import CityStreamLine_vertexShader from '../shader/路线流光/vertexShader';
import CityStreamLine_fragmentShader from '../shader/路线流光/fragmentShader';
import BuildingSpecialEffects_vertexShader from '../shader/建筑特效/vertexShader';
import BuildingSpecialEffects_fragmentShader from '../shader/建筑特效/fragmentShader';

namespace ShaderLib {
    /**
     * @渐隐围墙
     */
    export const RecedingEnclosure = {
        vs: RecedingEnclosure_vertexShader,
        fs: RecedingEnclosure_fragmentShader,
    }
    /**
     * @路线流光
     */
    export const CityStreamLine = {
        vs: CityStreamLine_vertexShader,
        fs: CityStreamLine_fragmentShader
    }
    /**
     * @建筑上下扫光
     * @建筑扩散光波
     * @高度颜色渐变
     * @建筑高度渐增
     */
    export const BuildingSpecialEffects = {
        vs: BuildingSpecialEffects_vertexShader,
        fs: BuildingSpecialEffects_fragmentShader
    }
};
export default ShaderLib;