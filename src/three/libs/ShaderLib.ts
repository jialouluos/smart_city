import RecedingEnclosure_vertexShader from '../shader/渐隐围墙/vertexShader'
import RecedingEnclosure_fragmentShader from '../shader/渐隐围墙/fragmentShader'
namespace ShaderLib {
    /**
     * @渐隐围墙
     */
    export const RecedingEnclosure = {
        vs: RecedingEnclosure_vertexShader,
        fs: RecedingEnclosure_fragmentShader,
    }
};
export default ShaderLib;