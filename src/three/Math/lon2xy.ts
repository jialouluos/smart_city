/**
 * 
 * @param longitude number
 * @param latitude  number
 * @returns-{x,y}:{number,number}
 */
const lon2xy_ = (longitude: number, latitude: number) => ({
    x: longitude * 20037508.34 / 180, //墨卡托x坐标——对应经度
    y: (Math.log(Math.tan((90 + latitude) * Math.PI / 360)) / (Math.PI / 180)) * 20037508.34 / 180, //墨卡托y坐标——对应维度
})
export default lon2xy_;