import * as THREE from 'three'
import Main from '../Main'
import City from '../three';
import RecedingFence, { IRecedingFence } from '../shader/渐隐围墙'
import CityLine, { ICityLine } from '../shader/线路流光';
import BuildingSpecialEffects from '../shader/建筑特效';
import BuildWireframe from '../shader/建筑线框';
import WaterWave from '../shader/水波';
export type T_RegionType = "region_1" | "region_2" | "region_3" | "region_4" | "region_5" | "region_6";
export type T_LineGroupType = "路" | "地铁" | "隧道" | "大道";
export type T_BaseManage = Map<string, THREE.Mesh>;
export type T_BaseState = Map<T_LineGroupType, Record<string, any>>;
export type T_CityLineManage = Map<T_LineGroupType, THREE.Object3D>;
export type T_CityLineState = Map<T_LineGroupType | "current", Record<string, any>>;

type T_SpecialEffectsKeys = "recedingFence" | "cityLine" | "buildingSpecialEffects" | "waterWave" | "buildWireframe";
type T_SpecialEffectsValues = RecedingFence | CityLine | BuildingSpecialEffects | WaterWave | BuildWireframe;
type T_SpecialEffectsManage = Map<T_SpecialEffectsKeys, T_SpecialEffectsValues>
/**
 * @负责管理特效
 */
export default class SpecialEffectsManage {
    /**
     * @K 每个特效的标识
     * @V 每个特效创建的实例
     */
    specialEffectsManage: T_SpecialEffectsManage;
    recedingFenceManages: T_BaseManage;//?渐隐围墙
    recedingFenceStates: T_BaseState;//?渐隐围墙
    cityLineManages: T_CityLineManage;//?城市路线
    cityLineStates: T_CityLineState;//?城市路线
    time !: { value: number }
    constructor(time: { value: number }) {
        this.time = time;
        this.recedingFenceManages = new Map();
        this.recedingFenceStates = new Map();
        this.cityLineManages = new Map();
        this.cityLineStates = new Map();
        this.specialEffectsManage = new Map();
    }
    init() {
        this.initrecedingFenceManages();
        this.initcityLineManages();
        this.initbuildingSpecialEffects();
        this.initwaterWave();
        this.initbuildWireframe();
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
    initcityLineManages() {
        this.specialEffectsManage.set("cityLine", new Main.SpecialEffectsLib.cityLine(this.time));
        this.cityLineStates.set("路", { color: new THREE.Color("#00ffff") });
        this.cityLineStates.set("地铁", { color: new THREE.Color("#cc00ff") });
        this.cityLineStates.set("隧道", { color: new THREE.Color("#ff9900") });
        this.cityLineStates.set("大道", { color: new THREE.Color("#d9ff00") });
    }
    createcityLine(routerType: T_LineGroupType, style: "实线" | "飞线" | "融合", city: City) {
        (this.specialEffectsManage.get("cityLine") as CityLine)!.createLineGroup(routerType, { color: this.cityLineStates.get(routerType)!.color }, this.cityLineManages, this.cityLineStates, style, city);
    }
    updatecityLine(routerType: T_LineGroupType, options: ICityLine) {
        (this.specialEffectsManage.get("cityLine") as CityLine)!.updateParams(routerType, this.cityLineManages, this.cityLineStates, options)
    }
    /**
    * @建筑特效
    */
    initbuildingSpecialEffects() {
        this.specialEffectsManage.set("buildingSpecialEffects", new Main.SpecialEffectsLib.buildingSpecialEffects(this.time));
    }
    createbuildingSpecialEffects(ModelGroup: Map<string, THREE.Mesh>) {
        (this.specialEffectsManage.get("buildingSpecialEffects") as BuildingSpecialEffects)!.useSpecialEffectComposer(ModelGroup, {});
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
    /**
    * @建筑线框
    */
    initbuildWireframe() {
        this.specialEffectsManage.set("buildWireframe", new Main.SpecialEffectsLib.buildWireframe(this.time));
    }
    createbuildWireframe(ModelGroup: Map<string, THREE.Mesh>, Scene: THREE.Scene) {
        (this.specialEffectsManage.get("buildWireframe") as BuildWireframe)!.useSpecialEffectComposer(ModelGroup.get(`city_1`)!, {}, Scene);
        (this.specialEffectsManage.get("buildWireframe") as BuildWireframe)!.useSpecialEffectComposer(ModelGroup.get(`city_2`)!, {}, Scene);
        (this.specialEffectsManage.get("buildWireframe") as BuildWireframe)!.useSpecialEffectComposer(ModelGroup.get(`city_3`)!, {}, Scene);
        (this.specialEffectsManage.get("buildWireframe") as BuildWireframe)!.useSpecialEffectComposer(ModelGroup.get(`city_4`)!, {}, Scene);
        (this.specialEffectsManage.get("buildWireframe") as BuildWireframe)!.useSpecialEffectComposer(ModelGroup.get(`city_5`)!, {}, Scene);
        (this.specialEffectsManage.get("buildWireframe") as BuildWireframe)!.useSpecialEffectComposer(ModelGroup.get(`city_6`)!, {}, Scene);
        (this.specialEffectsManage.get("buildWireframe") as BuildWireframe)!.useSpecialEffectComposer(ModelGroup.get(`city_7`)!, {}, Scene);
    }
}