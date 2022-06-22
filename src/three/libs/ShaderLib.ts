import RecedingEnclosure_vertexShader from '../shader/渐隐围墙/vertexShader'
import RecedingEnclosure_fragmentShader from '../shader/渐隐围墙/fragmentShader'
import CityStreamLine_vertexShader from '../shader/路线流光/vertexShader';
import CityStreamLine_fragmentShader from '../shader/路线流光/fragmentShader';
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
};
export default ShaderLib;