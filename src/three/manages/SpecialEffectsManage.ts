import * as THREE from 'three'
import RecedingFence from '../shader/渐隐围墙'
import CityStreamLine from '../shader/路线流光';
import Main from '../Main'
import { ICityStreamLine } from '../shader/路线流光'
import { IRecedingFence } from '../shader/渐隐围墙'
type T_regionType = "region_1" | "region_2" | "region_3" | "region_4" | "region_5" | "region_6";
type T_lineGroupType = "路" | "地铁" | "隧道" | "通道" | "大道"
type T_BaseManage = Map<string, THREE.Mesh>;
type T_BaseState = Map<string, Record<string, any>>;
type T_cityStreamLineManage = Map<string, THREE.Group>;
type T_SpecialEffectsKeys = "recedingFence" | "cityStreamLine";
type T_SpecialEffectsValues = RecedingFence | CityStreamLine;
type T_SpecialEffectsManage = Map<T_SpecialEffectsKeys, T_SpecialEffectsValues>
/**
 * @负责管理特效
 */
export default class SpecialEffectsManage {
    /**
     * @K 每个特效的实例
     * @V 每个特效的实例创建的实例
     */
    specialEffectsManage: T_SpecialEffectsManage;
    /**
     * @K 标记名
     * @V 特效几何
     */
    recedingFenceManages: T_BaseManage;
    /**
     * @状态记录
     */
    recedingFenceStates: T_BaseState;
    cityStreamLineManages: T_cityStreamLineManage;
    cityStreamLineStates: T_BaseState;
    time !: { value: number }
    constructor(time: { value: number }) {
        this.time = time;
        this.recedingFenceManages = new Map();
        this.recedingFenceStates = new Map();
        this.cityStreamLineManages = new Map();
        this.cityStreamLineStates = new Map();
        this.specialEffectsManage = new Map();
    }
    init() {
        this.initrecedingFenceManages();
        this.initcityStreamLineManages();
    }
    /**
     * @初始化渐隐围墙
     */
    initrecedingFenceManages() {
        this.specialEffectsManage.set("recedingFence", new Main.SpecialEffectsLib.recedingFence(this.time));
        this.createrecedingFence("region_1")
    }
    createrecedingFence(reginType: T_regionType) {
        (this.specialEffectsManage.get("recedingFence") as RecedingFence)!.createRegionGroup(reginType, {}, this.recedingFenceManages, this.recedingFenceStates);
    }
    updaterecedingFence(options: IRecedingFence) {
        (this.specialEffectsManage.get("recedingFence") as RecedingFence)!.updateParams(this.recedingFenceManages, options)
    }
    /**
     * @初始化路线流光
     */
    initcityStreamLineManages() {
        this.specialEffectsManage.set("cityStreamLine", new Main.SpecialEffectsLib.cityStreamLine(this.time));
    }
    createcityStreamLine(routerType: T_lineGroupType) {
        (this.specialEffectsManage.get("cityStreamLine") as CityStreamLine)!.createLineGroup(routerType, {}, this.cityStreamLineManages, this.cityStreamLineStates);
    }
    updatecityStreamLine(options: ICityStreamLine) {
        (this.specialEffectsManage.get("cityStreamLine") as CityStreamLine)!.updateParams(this.cityStreamLineManages, options)
    }
}