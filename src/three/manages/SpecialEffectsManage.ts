import * as THREE from 'three'
import RecedingFence from '../shader/渐隐围墙'
import CityStreamLine from '../shader/路线流光';
import Main from '../Main'
import { ICityStreamLine } from '../shader/路线流光'
import { IRecedingFence } from '../shader/渐隐围墙'
import BuildingVirtualization from '../shader/楼房虚化';
import WaterWave from '../shader/水波';
import City from '../three';
export type T_RegionType = "region_1" | "region_2" | "region_3" | "region_4" | "region_5" | "region_6";
export type T_LineGroupType = "路" | "地铁" | "隧道" | "大道";
export type T_BaseManage = Map<string, THREE.Mesh>;
export type T_BaseState = Map<T_LineGroupType, Record<string, any>>;
export type T_CityStreamLineManage = Map<T_LineGroupType, THREE.Object3D>;
export type T_CityStreamLineState = Map<T_LineGroupType | "current", Record<string, any>>;

type T_SpecialEffectsKeys = "recedingFence" | "cityStreamLine" | "buildingVirtualization" | "waterWave";
type T_SpecialEffectsValues = RecedingFence | CityStreamLine | BuildingVirtualization | WaterWave;
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
    cityStreamLineManages: T_CityStreamLineManage;
    cityStreamLineStates: T_CityStreamLineState;
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
        this.initbuildingVirtualization();
        this.initwaterWave();
    }
    /**
     * @渐隐围墙
     */
    initrecedingFenceManages() {
        this.specialEffectsManage.set("recedingFence", new Main.SpecialEffectsLib.recedingFence(this.time));
        this.createrecedingFence("region_1")
    }
    createrecedingFence(reginType: T_RegionType) {
        (this.specialEffectsManage.get("recedingFence") as RecedingFence)!.createRegionGroup(reginType, {}, this.recedingFenceManages, this.recedingFenceStates);
    }
    updaterecedingFence(options: IRecedingFence) {
        (this.specialEffectsManage.get("recedingFence") as RecedingFence)!.updateParams(this.recedingFenceManages, options)
    }
    /**
     * @路线流光
     */
    initcityStreamLineManages() {
        this.specialEffectsManage.set("cityStreamLine", new Main.SpecialEffectsLib.cityStreamLine(this.time));
        this.cityStreamLineStates.set("路", { color: new THREE.Color("#00ffff") });
        this.cityStreamLineStates.set("地铁", { color: new THREE.Color("#cc00ff") });
        this.cityStreamLineStates.set("隧道", { color: new THREE.Color("#ff9900") });
        this.cityStreamLineStates.set("大道", { color: new THREE.Color("#d9ff00") });
    }
    createcityStreamLine(routerType: T_LineGroupType, style: "实线" | "飞线" | "融合", city: City) {
        (this.specialEffectsManage.get("cityStreamLine") as CityStreamLine)!.createLineGroup(routerType, { color: this.cityStreamLineStates.get(routerType)!.color }, this.cityStreamLineManages, this.cityStreamLineStates, style, city);
    }
    updatecityStreamLine(routerType: T_LineGroupType, options: ICityStreamLine) {
        (this.specialEffectsManage.get("cityStreamLine") as CityStreamLine)!.updateParams(routerType, this.cityStreamLineManages, this.cityStreamLineStates, options)
    }
    /**
   * @楼房虚化通道处理
   */
    initbuildingVirtualization() {
        this.specialEffectsManage.set("buildingVirtualization", new Main.SpecialEffectsLib.buildingVirtualization(this.time));
    }
    createbuildingVirtualization(ModelGroup: Map<string, THREE.Mesh>) {
        (this.specialEffectsManage.get("buildingVirtualization") as BuildingVirtualization)!.useSpecialEffectComposer(ModelGroup, {});
    }
    /**
  * @水波
  */
    initwaterWave() {
        this.specialEffectsManage.set("waterWave", new Main.SpecialEffectsLib.waterWave(this.time));
    }
    createwaterWave(Mesh: THREE.Mesh, Scene: THREE.Scene) {
        (this.specialEffectsManage.get("waterWave") as WaterWave)!.useSpecialEffectComposer(Mesh, {}, Scene);
    }
}