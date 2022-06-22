
type T_recedingFenceType = "region_1" | "region_2" | "region_3" | "region_4" | "region_5" | "region_6";
namespace CityStaticDataLib {
    export const recedingFence: { name: T_recedingFenceType, value: { position: [number, number, number], data: [number, number][] } }[] = [{
        name: "region_1",
        value: {
            position: [0, 0, 0],
            data: [[0, 0], [6, 0], [6, 8], [4, 12], [2, 7], [0, 0]]
        }
    }]
};
export default CityStaticDataLib;
