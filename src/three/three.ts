
import * as  THREE from 'three';
import Main from './Main';
import BaseLineManage from './manages/BaseLineManage';
import SpecialEffectsManage from './manages/SpecialEffectsManage';
export default class City extends Main {
    modelManageGroup!: Map<string, THREE.Mesh>
    lineManage!: BaseLineManage;
    translateBox !: THREE.Box3;
    SpecialEffectsManage: SpecialEffectsManage;
    constructor(el: HTMLDivElement, debug: boolean) {
        super(el, debug);
        this.modelManageGroup = new Map<string, THREE.Mesh>();
        this.lineManage = new BaseLineManage();
        this.SpecialEffectsManage = new SpecialEffectsManage(this.time);
        this.translateBox = new THREE.Box3();
    }
    init() {
        super.init();//初始化渲染器以及场景
        this.lineManage.init();//加载绘制线所需数据
    }
    /**
     * @在创建渲染器时-钩子
     */
    onCreateMoment() {//
        this.initEnvironmentMap();
        this.loadMainModel();
    }
    /**
     * @在更新时-钩子
     */
    onUpdateMoment() {

    }
    /**
     * @在主模型加载完毕之后-钩子
     */
    onMainModelLoadCompleted() {
        this.loadLine();
        this.loadSpecialEffects();
    }
    /**
     * @加载特效
     */
    loadSpecialEffects() {
    }
    loadLine() {
        const groups = new THREE.Group();
        this.lineManage.lineTypes.forEach(e => {
            this.lineManage.createLineGroup(e);
            const group = this.lineManage.lineGroups.get(e);
            const { min: { x, y, z } } = this.translateBox;
            group && group.scale.set(0.1, 0.1, 0.1) && (group.rotation.x -= Math.PI * 0.5);
            group && (group.position.x -= x) && (group.position.y -= y) && (group.position.z -= z);
            groups.add(group!)
        })
        this.scene.add(groups)
        console.log(this.scene)
    }
    // onModelLoadAfter(box: THREE.Box3) {
    //     this.modelLoaderByDraco.loadAsync('./model/line_d.glb').then(res => {
    //         const model = res.scene;
    //         this.scene.add(model);
    //         model.scale.set(0.1, 0.1, 0.1);
    //         model.rotation.x -= Math.PI * 0.5;
    //         model.position.x -= box.min.x;
    //         model.position.y -= box.min.y;
    //         model.position.z -= box.min.z;
    //     })
    //     this.BindModelToMap();
    //     this.correctModel();
    // }
    /**
     * @修正模型
     */
    correctModel() {
        this.modelManageGroup.get('river')!.position.y += 0.9;
    }
    /**
     * @获取场景中的模型
     */
    BindModelToMap() {
        this.modelManageGroup.set(`ground`, this.scene.getObjectByName(`地面`) as THREE.Mesh)
        this.modelManageGroup.set(`river`, this.scene.getObjectByName(`河流`) as THREE.Mesh)
        this.modelManageGroup.set(`build`, this.scene.getObjectByName(`楼房`) as THREE.Mesh)
        this.modelManageGroup.set(`上海中心大厦`, this.scene.getObjectByName(`上海中心大厦`) as THREE.Mesh)
        this.modelManageGroup.set(`东方明珠`, this.scene.getObjectByName(`东方明珠`) as THREE.Mesh)
        this.modelManageGroup.set(`环球金融中心`, this.scene.getObjectByName(`环球金融中心`) as THREE.Mesh)
        this.modelManageGroup.set(`金茂大厦`, this.scene.getObjectByName(`金茂大厦`) as THREE.Mesh)
        console.log(this.scene)
    }
    /**
     * @用于加载City模型
     */
    loadMainModel() {
        this.modelLoaderByDraco.loadAsync('./model/city_d.glb').then(res => {
            const model = res.scene;
            this.scene.add(model);
            model.scale.set(0.1, 0.1, 0.1);
            model.rotation.x -= Math.PI * 0.5;
            this.translateBox.expandByObject(model);
            const { min: { x, y, z } } = this.translateBox;
            model.position.x -= x;
            model.position.y -= y;
            model.position.z -= z;
            this.onMainModelLoadCompleted();
        })
    }
    /**
    * @生成天空盒
    */
    initEnvironmentMap() {

        const envmapLoader = new THREE.CubeTextureLoader().setPath("./textures/cubeMaps/");
        const urlMapArray = new Array(6).fill('').map((item, index) => (index + 1) + '.jpg');
        envmapLoader.load(urlMapArray, map => {
            map.mapping = THREE.CubeRefractionMapping;
            this.scene.background = map;
            this.scene.environment = map;
        })
    }
}

