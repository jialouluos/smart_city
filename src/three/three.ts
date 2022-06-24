
import * as  THREE from 'three';
import Main from './Main';
import SpecialEffectsManage from './manages/SpecialEffectsManage';
import TweenManage from './manages/TweenManage';
import ParamsControlManage from './manages/ParamsControlManage';
export default class City extends Main {
    modelManageGroup!: Map<string, THREE.Mesh>
    translateBox !: THREE.Box3;
    SpecialEffectsManage: SpecialEffectsManage;
    ModelGroups!: THREE.Group;
    TweenManage!: TweenManage;
    ParamsControlManage!: ParamsControlManage;
    constructor(el: HTMLDivElement, debug: boolean) {
        super(el, debug);
        this.modelManageGroup = new Map<string, THREE.Mesh>();
        this.SpecialEffectsManage = new SpecialEffectsManage(this.time);
        this.ParamsControlManage = new ParamsControlManage();
        this.translateBox = new THREE.Box3();
        this.ModelGroups = new THREE.Group();
    }
    init = () => {
        this.createScene('', { gui: true, stats: true });
        this.createCamera('PerspectiveCamera', new THREE.Vector3(88, 23, -80));
        this.createRenderer({ alpha: true });
        this.createLight();
        this.createControls();
        this.addListeners();
        this.onCreateMoment();
        this.setAnimate();
        this.TweenManage = new TweenManage(this.scene, this.camera as THREE.PerspectiveCamera, this.container!);
        this.initGui();
    }
    /**
     * @在创建渲染器时-钩子
     */
    onCreateMoment = () => {//
        this.scene.add(this.ModelGroups);
        this.initEnvironmentMap();
        this.SpecialEffectsManage.init();
        this.loadMainModel();
    }
    /**
     * @在更新时-钩子
     */
    onUpdateMoment = () => {

    }
    /**
     * @在主模型加载完毕之后-钩子
     */
    onMainModelLoadCompleted = () => {
        this.loadLine();
        this.BindModelToMap();
        this.loadSpecialEffects();
        this.onEveryIsReady();
    }
    /**
     * @在一切都加载完毕时-钩子
     */
    onEveryIsReady = () => {
        this.TweenManage.loadCameraRotation(100, new THREE.Vector2(40, 40))
    }
    /**
     * @加载特效
     */
    loadSpecialEffects = () => {
        this.SpecialEffectsManage.createbuildingVirtualization(this.modelManageGroup);
    }
    loadLine = () => {
        const lineGroups = this.SpecialEffectsManage.specialEffectsManage.get("cityStreamLine")!.ModelGroup;
        const { min: { x, y, z } } = this.translateBox;
        const { max: { x: x2, y: y2, z: z2 } } = this.translateBox;
        lineGroups && lineGroups.scale.set(0.1, 0.1, 0.1) && (lineGroups.rotation.x -= Math.PI * 0.5);
        lineGroups && (lineGroups.position.x -= (x + x2) / 2.0) && (lineGroups.position.y -= (y + y2) / 2.0) && (lineGroups.position.z -= (z + z2) / 2.0);
        lineGroups.name = 'lineGroup';
        this.ModelGroups.add(lineGroups);
        const regionGroups = this.SpecialEffectsManage.specialEffectsManage.get("recedingFence")!.ModelGroup;
        regionGroups.name = 'regionGroups';
        this.ModelGroups.add(regionGroups);
    }
    /**
     * @修正模型
     */
    correctModel = () => {
        this.modelManageGroup.get('river')!.position.z += 0.5;
        this.modelManageGroup.get('lineGroup')!.position.y += 1;
        this.modelManageGroup.get('ground')!.position.y -= 1;
    }
    /**
     * @获取场景中的模型
     */
    BindModelToMap = () => {
     
        this.modelManageGroup.set(`ground`, this.scene.getObjectByName(`地面`) as THREE.Mesh)
        this.modelManageGroup.set(`river`, this.scene.getObjectByName(`河流`) as THREE.Mesh)
        this.modelManageGroup.set(`楼房`, this.scene.getObjectByName(`楼房`) as THREE.Mesh)
        this.modelManageGroup.set(`上海中心大厦`, this.scene.getObjectByName(`上海中心大厦`) as THREE.Mesh)
        this.modelManageGroup.set(`东方明珠`, this.scene.getObjectByName(`东方明珠`) as THREE.Mesh)
        this.modelManageGroup.set(`环球金融中心`, this.scene.getObjectByName(`环球金融中心`) as THREE.Mesh)
        this.modelManageGroup.set(`金茂大厦`, this.scene.getObjectByName(`金茂大厦`) as THREE.Mesh)
        this.modelManageGroup.set('lineGroup', this.scene.getObjectByName(`lineGroup`) as THREE.Mesh)
        this.modelManageGroup.set('cityGroup', this.scene.getObjectByName(`cityGroup`) as THREE.Mesh)
        this.modelManageGroup.set('regionGroup', this.scene.getObjectByName(`regionGroups`) as THREE.Mesh)
        this.modelManageGroup.set(`city_1_1`, this.scene.getObjectByName(`city_1_1`) as THREE.Mesh)
        this.modelManageGroup.set(`city_2_1`, this.scene.getObjectByName(`city_2_1`) as THREE.Mesh)
        this.modelManageGroup.set(`city_3_1`, this.scene.getObjectByName(`city_3_1`) as THREE.Mesh)
        this.modelManageGroup.set(`city_4_1`, this.scene.getObjectByName(`city_4_1`) as THREE.Mesh)
        this.modelManageGroup.set(`city_5_1`, this.scene.getObjectByName(`city_5_1`) as THREE.Mesh)
        this.modelManageGroup.set(`city_6_1`, this.scene.getObjectByName(`city_6_1`) as THREE.Mesh)
        this.modelManageGroup.set(`build`, this.scene.getObjectByName(`build`) as THREE.Mesh)
        this.correctModel()
    }
    /**
     * @用于加载City模型
     */
    loadMainModel = () => {
        this.modelLoaderByDraco.loadAsync('./model/city_d.glb').then(res => {
            const model = res.scene;
            model.name = "cityGroup"
            this.ModelGroups.add(model)
            model.scale.set(0.1, 0.1, 0.1);
            model.rotation.x -= Math.PI * 0.5;
            this.translateBox.expandByObject(model);
            const { min: { x, y, z } } = this.translateBox;
            const { max: { x: x2, y: y2, z: z2 } } = this.translateBox;
            model.position.x -= (x + x2) / 2.0;
            model.position.y -= (y + y2) / 2.0;
            model.position.z -= (z + z2) / 2.0;
            this.onMainModelLoadCompleted();
        })
    }
    /**
    * @生成天空盒
    */
    initEnvironmentMap = () => {

        const envmapLoader = new THREE.CubeTextureLoader().setPath("./textures/cubeMaps/");
        const urlMapArray = new Array(6).fill('').map((item, index) => (index + 1) + '.jpg');
        envmapLoader.load(urlMapArray, map => {
            map.mapping = THREE.CubeRefractionMapping;
            this.scene.background = map;
            this.scene.environment = map;
        })
    }
    /**
     * @初始化Gui
     */
    initGui = () => {

    }
}

