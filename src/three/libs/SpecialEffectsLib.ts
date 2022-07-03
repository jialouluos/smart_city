import WaterWave from '../shader/水波';
import BuildingSpecialEffects from '../shader/建筑特效'
import RecedingFence from '../shader/渐隐围墙'
import CityStreamLine from '../shader/路线流光'
namespace SpecialEffectsLib {
    /**
     * @渐隐围墙
     */
    export const recedingFence = RecedingFence
    /**
     * @路线流光
     */
    export const cityStreamLine = CityStreamLine
    /**
     * @建筑上下扫光
     * @建筑扩散光波
     * @高度颜色渐变
     * @建筑高度渐增
     */
    export const buildingSpecialEffects = BuildingSpecialEffects
    /**
     * @水波
     */
    export const waterWave = WaterWave
};
export default SpecialEffectsLib;