import WaterWave from '../shader/水波';
import BuildingSpecialEffects from '../shader/建筑特效'
import RecedingFence from '../shader/渐隐围墙'
import CityLine from '../shader/线路流光'
import BuildWireframe from '../shader/建筑线框';
namespace SpecialEffectsLib {
    /**
     * @渐隐围墙
     */
    export const recedingFence = RecedingFence
    /**
     * @路线流光
     */
    export const cityLine = CityLine
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
    /**
     * @建筑线框
     */
    export const buildWireframe = BuildWireframe
};
export default SpecialEffectsLib;