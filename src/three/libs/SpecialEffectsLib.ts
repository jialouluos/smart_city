import WaterWave from '../shader/水波';
import BuildingVirtualization from '../shader/楼房虚化'
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
    export const buildingVirtualization = BuildingVirtualization
    /**
     * @水波
     */
    export const waterWave = WaterWave
};
export default SpecialEffectsLib;