import * as THREE from 'three'
import CityDataLib from '../libs/CityDataLib';
import RecedingFence from '../shader/渐隐围墙'
import Main from '../Main'
type T_RecedingFenceManage = Map<string, THREE.Mesh>;//渐隐围墙
type T_RecedingFenceStates = Map<string, Record<string, any>>;//渐隐围墙
type T_SpecialEffectsKeys = "recedingFence";
type T_SpecialEffectsValues = RecedingFence;
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
    recedingFenceManages: T_RecedingFenceManage;
    /**
     * @状态记录
     */
    recedingFenceStates: T_RecedingFenceStates;
    time !: { value: number }
    constructor(time: { value: number }) {
        this.time = time;
        this.recedingFenceManages = new Map();
        this.recedingFenceStates = new Map();
        this.specialEffectsManage = new Map();
    }
    init() {
        this.initrecedingFenceManages();
    }
    /**
     * @初始化渐隐围墙
     */
    initrecedingFenceManages() {
        this.specialEffectsManage.set("recedingFence", new Main.SpecialEffectsLib.recedingFence(this.time))
        const recedingFence_1 = this.specialEffectsManage.get("recedingFence")!.createMesh(CityDataLib.recedingFence.pre_1.getData(),
            { height: 8, color: new THREE.Color("#ff0000"), name: "recedingFence_1" })!;
        this.recedingFenceManages.set("recedingFence_1", recedingFence_1)
        this.recedingFenceStates.set("recedingFence_1", {})

    }
}