// import * as THREE from 'three'
import { ICanvasControlsParams } from '../../pages/SandBox/index'
import City from '../three';
type T_Type = Pick<ICanvasControlsParams, 'type'>;
type T_Params = Omit<ICanvasControlsParams, 'type'>
export default class ParamsControlManage {
    params!: ICanvasControlsParams
    x: number
    constructor() {
        this.x = 1;
    }
    init(params: ICanvasControlsParams) {
        this.params = params;
    }
    paramsUpdate(params: T_Params, { type }: T_Type, city: City) {
        if (type === 'region') {
            // console.log("region改变")
            // console.log(city)
        }
        else if (type === 'route') {
            const { routeStyle, routeType } = params;
            const entries = city.SpecialEffectsManage.cityStreamLineManages.values();
            for (let value of entries) {
                value.children.forEach(e => {
                    //?先将组中所有的网格层级都设置为1，即先全部隐藏
                    e.layers.set(1)
                })
            }
            //?如果不存在该类型的线则绘制
            if (!city.SpecialEffectsManage.cityStreamLineManages.get(routeType)) {
                city.SpecialEffectsManage.createcityStreamLine(routeType, routeStyle, city.track)
            }
            //?如果存在，再进行当前线风格判断
            else {
                const { style } = city.SpecialEffectsManage.cityStreamLineStates.get(routeType)!;
                if (routeStyle === style) {
                    //?如果风格和之前的一致，则直接将之前的显示就行，无需再次绘制
                    city.SpecialEffectsManage.cityStreamLineManages.get(routeType)?.children.forEach(e => {
                        e.layers.set(0)
                    })
                }
                else {
                    //?如果风格不一致，则需要将之前的销毁并重新绘制
                    city.track.disTrackByGroup(city.SpecialEffectsManage.cityStreamLineManages.get(routeType)!);
                    city.SpecialEffectsManage.cityStreamLineManages.delete(routeType);//!删除键值对
                    city.SpecialEffectsManage.createcityStreamLine(routeType, routeStyle, city.track);
                }
            }
        } else if (type === "style") {
            const { routeStyle, routeType } = params;
            //?如果不存在该类型的线则直接结束
            if (!city.SpecialEffectsManage.cityStreamLineManages.get(routeType)) return;
            //?通过状态管理Map去获取当前的网格组和对应的线绘制风格
            const { group, linetype } = city.SpecialEffectsManage.cityStreamLineStates.get("current")!;
            const { style } = city.SpecialEffectsManage.cityStreamLineStates.get(linetype)!;
            //?如果风格一致，则直接结束，防止多次点击造成的多次绘制
            if (routeStyle === style) return;
            city.track.disTrackByGroup(group);
            city.SpecialEffectsManage.cityStreamLineManages.delete(routeType);//!删除键值对
            city.SpecialEffectsManage.createcityStreamLine(routeType, routeStyle, city.track);
            // console.log(city.info());
        }
    }
}