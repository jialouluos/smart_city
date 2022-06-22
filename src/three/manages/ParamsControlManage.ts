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
    handlerUpdate(type: string) {

    }
    async paramsUpdate(params: T_Params, { type }: T_Type, city: City) {
        if (type === 'region') {
            // console.log("region改变")
            // console.log(city)
        }
        else if (type === 'route') {
            const entries = city.SpecialEffectsManage.cityStreamLineManages.values();
            for (let value of entries) {
                value.children.forEach(e => {
                    e.layers.set(1)
                })
            }
            if (!city.SpecialEffectsManage.cityStreamLineManages.get(params.routeType)) {
                city.SpecialEffectsManage.createcityStreamLine(params.routeType)
            } else {
                city.SpecialEffectsManage.updatecityStreamLine({ flyLineStyle: 0.0 })
                city.SpecialEffectsManage.cityStreamLineManages.get(params.routeType)?.children.forEach(e => {
                    e.layers.set(0)
                })
            }
        } else if (type === "style") {
            const { routeStyle } = params;
            if (routeStyle === "实线") {
                city.SpecialEffectsManage.updatecityStreamLine({ flyLineStyle: 0.0 })
            } else if (routeStyle === "飞线") {
                city.SpecialEffectsManage.updatecityStreamLine({ flyLineStyle: 0.2 })
            } else {
                city.SpecialEffectsManage.updatecityStreamLine({ flyLineStyle: 0.1 })
            }
        }
    }
}