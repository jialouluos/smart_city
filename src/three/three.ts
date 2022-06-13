
import * as  THREE from 'three';
import Main from './Main';
import RecedingFence from './shader/渐隐围墙';
export default class City extends Main {
    ModelManageGroup!: Map<string, THREE.Mesh>
    constructor(el: HTMLDivElement, debug: boolean) {
        super(el, debug);
        this.ModelManageGroup = new Map<string, THREE.Mesh>();
    }
    init(): void {
        this.createScene('', { gui: true, stats: true });
        this.createCamera('PerspectiveCamera', new THREE.Vector3(0, 20, 40));
        this.createRenderer({ alpha: true });
        this.createLight();
        this.createControls();
        this.addListeners();
        this.createEvery();
        this.setAnimate();
    }
    createEvery() {
        this.initEnvironmentMap();
        this.loadModel();
    }
    initEnvironmentMap() {
        const envmapLoader = new THREE.CubeTextureLoader().setPath("./textures/cubeMaps/");
        const urlMapArray = new Array(6).fill('').map((item, index) => (index + 1) + '.jpg');
        envmapLoader.load(urlMapArray, map => {
            map.mapping = THREE.CubeRefractionMapping;
            this.scene.background = map;
            this.scene.environment = map;
        })
    }
    onModelLoadAfter(box: THREE.Box3) {
        this.modelLoaderByDraco.loadAsync('./model/line_d.glb').then(res => {
            const model = res.scene;
            this.scene.add(model);
            model.scale.set(0.1, 0.1, 0.1);
            model.rotation.x -= Math.PI * 0.5;
            model.position.x -= box.min.x;
            model.position.y -= box.min.y;
            model.position.z -= box.min.z;
            console.log("纱布聪")
        })
        this.BindModelToMap();
        this.correctModel();


    }
    correctModel() {
        this.ModelManageGroup.get('river')!.position.y += 0.9;
    }
    BindModelToMap() {
        this.ModelManageGroup.set(`ground`, this.scene.getObjectByName(`地面`) as THREE.Mesh)
        this.ModelManageGroup.set(`river`, this.scene.getObjectByName(`河流`) as THREE.Mesh)
        this.ModelManageGroup.set(`build`, this.scene.getObjectByName(`楼房`) as THREE.Mesh)
        this.ModelManageGroup.set(`上海中心大厦`, this.scene.getObjectByName(`上海中心大厦`) as THREE.Mesh)
        this.ModelManageGroup.set(`东方明珠`, this.scene.getObjectByName(`东方明珠`) as THREE.Mesh)
        this.ModelManageGroup.set(`环球金融中心`, this.scene.getObjectByName(`环球金融中心`) as THREE.Mesh)
        this.ModelManageGroup.set(`金茂大厦`, this.scene.getObjectByName(`金茂大厦`) as THREE.Mesh)
        console.log(this.scene)
    }
    loadModel() {
        this.modelLoaderByDraco.loadAsync('./model/city_d.glb').then(res => {
            const model = res.scene;
            this.scene.add(model);
            model.scale.set(0.1, 0.1, 0.1);
            model.rotation.x -= Math.PI * 0.5;
            const box = new THREE.Box3();
            box.expandByObject(model);
            model.position.x -= box.min.x;
            model.position.y -= box.min.y;
            model.position.z -= box.min.z;
            this.onModelLoadAfter(box);
        })
        const recedingFence = new RecedingFence(this.time)
        const data = [0, 0,
            6, 0,
            6, 8,
            4, 12,
            2, 7,
            0, 0
        ]
        this.scene.add(recedingFence.createMesh(data, 8, new THREE.Color("#ff0000"))!)
    }

}

