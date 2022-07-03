
import * as  THREE from 'three';
import Main from './Main';
import SpecialEffectsManage from './manages/SpecialEffectsManage';
import TweenManage from './manages/TweenManage';
import ParamsControlManage from './manages/ParamsControlManage';
export default class City extends Main {
    modelManageGroup!: Map<string, THREE.Mesh>
    /**
     * max: Vector3
x: 1353225.7317487632
y: 66.28731078178433
z: -365618.22435773845
min: Vector3
isVector3: true
x: 1351724.2173374298
y: -0.8316316560008878
z: -367219.78762105067
     */
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
        this.translateBox = new THREE.Box3(new THREE.Vector3(1351724.2173374298, -0.8316316560008878, -367219.78762105067), new THREE.Vector3(1353225.7317487632, 66.28731078178433, -365618.22435773845));
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
        // this.loadRiver();
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
        // const geometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
        // const material = new THREE.MeshBasicMaterial({ color: "#ff0000" })
        // const mesh = new THREE.Mesh(geometry, material)
        // this.scene.add(mesh)
        this.SpecialEffectsManage.createbuildingVirtualization(this.modelManageGroup);
        this.SpecialEffectsManage.createwaterWave(this.modelManageGroup.get('river')!, this.scene);
    }
    loadLine = () => {
        const lineGroups = this.SpecialEffectsManage.specialEffectsManage.get("cityStreamLine")!.ModelGroup;
        this.ModelGroups.add(lineGroups);
        const regionGroups = this.SpecialEffectsManage.specialEffectsManage.get("recedingFence")!.ModelGroup;
        regionGroups.name = 'regionGroup';
        this.ModelGroups.add(regionGroups);
    }
    /**
     * @修正模型
     */
    correctModel = () => {
        // this.modelManageGroup.get('lineGroup')!.position.y += 30;
        this.modelManageGroup.get('ground')!.position.y -= 1;

    }
    /**
     * @获取场景中的模型
     */
    BindModelToMap = () => {

        this.modelManageGroup.set(`ground`, this.scene.getObjectByName(`地面`) as THREE.Mesh)
        this.modelManageGroup.set(`river`, this.scene.getObjectByName(`river`) as THREE.Mesh)
        this.modelManageGroup.set(`上海中心大厦`, this.scene.getObjectByName(`上海中心大厦`) as THREE.Mesh)
        this.modelManageGroup.set(`东方明珠`, this.scene.getObjectByName(`东方明珠`) as THREE.Mesh)
        this.modelManageGroup.set(`环球金融中心`, this.scene.getObjectByName(`环球金融中心`) as THREE.Mesh)
        this.modelManageGroup.set(`金茂大厦`, this.scene.getObjectByName(`金茂大厦`) as THREE.Mesh)
        this.modelManageGroup.set('lineGroup', this.scene.getObjectByName(`lineGroup`) as THREE.Mesh)
        this.modelManageGroup.set('cityGroup', this.scene.getObjectByName(`cityGroup`) as THREE.Mesh)
        this.modelManageGroup.set('regionGroup', this.scene.getObjectByName(`regionGroup`) as THREE.Mesh)
        this.modelManageGroup.set('车辆消失点', this.scene.getObjectByName(`车辆消失点`) as THREE.Mesh)
        this.modelManageGroup.set('车道轨迹', this.scene.getObjectByName(`车道轨迹`) as THREE.Mesh)
        this.modelManageGroup.set(`city_1`, this.scene.getObjectByName(`city_1`) as THREE.Mesh)
        this.modelManageGroup.set(`city_2`, this.scene.getObjectByName(`city_2`) as THREE.Mesh)
        this.modelManageGroup.set(`city_3`, this.scene.getObjectByName(`city_3`) as THREE.Mesh)
        this.modelManageGroup.set(`city_4`, this.scene.getObjectByName(`city_4`) as THREE.Mesh)
        this.modelManageGroup.set(`city_5`, this.scene.getObjectByName(`city_5`) as THREE.Mesh)
        this.modelManageGroup.set(`city_6`, this.scene.getObjectByName(`city_6`) as THREE.Mesh)
        this.modelManageGroup.set(`city_7`, this.scene.getObjectByName(`city_7`) as THREE.Mesh)
        this.modelManageGroup.set(`build`, this.scene.getObjectByName(`build`) as THREE.Mesh)
        this.correctModel()
    }
    /**
     * @用于加载City模型
     */
    loadMainModel = () => {
        this.modelLoaderByDraco.loadAsync('./model/city.glb').then(res => {
            const model = res.scene;
            model.name = "cityGroup";
            this.ModelGroups.add(model);
            console.log(this.scene);
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

