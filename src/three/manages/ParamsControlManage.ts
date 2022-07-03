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
            city.SpecialEffectsManage.createcityStreamLine(routeType, routeStyle, city)
        } else if (type === "style") {
            const { routeStyle } = params;
            const { SpecialEffectsManage: manage, SpecialEffectsManage: { cityStreamLineStates: cityState, cityStreamLineManages: cityManage } } = city
            //?如果状态中无current键值对,则说明一次都未绘制，直接返回。或者风格一致，则直接结束，防止多次点击造成的多次绘制
            if (!cityState.has("current") || routeStyle === cityState.get("current")!.style) return;
            const keys = cityManage.keys();
            for (let item of keys) {
                if (cityState.get(item)!.style !== routeStyle) {
                    manage.createcityStreamLine(item, routeStyle, city)
                }
            }
            // city.info();
        }
    }
}