import WaterWave from '../shader/水波';
import BuildingSpecialEffects from '../shader/建筑上下扫光、建筑扩散光波'
import RecedingFence from '../shader/渐隐围墙'
import CityStreamLine from '../shader/路线流光'
namespace SpecialEffectsLib {
    /**
     * @渐隐围墙_shader特效
     */
    export const recedingFence = RecedingFence
    /**
     * @路线流光_shader特效
     */
    export const cityStreamLine = CityStreamLine
    /**
    * @楼房虚化
    */
    export const buildingSpecialEffects = BuildingSpecialEffects
    /**
     * @水波
     */
    export const waterWave = WaterWave
};
export default SpecialEffectsLib;