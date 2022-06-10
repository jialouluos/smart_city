import * as  THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Track from './disposeManage'
let renderer!: THREE.WebGLRenderer;
let camera!: THREE.PerspectiveCamera;
let scene!: THREE.Scene;
// let textureLoader!: THREE.TextureLoader;
let envmapLoader !: THREE.CubeTextureLoader;
let GltfLoader: GLTFLoader;
let dirlight!: THREE.DirectionalLight;
let controls!: OrbitControls;
let stats!: Stats;
let animateId: number;
const track: Track = new Track();
const getAspect = (el: HTMLElement): number => el.clientWidth / el.clientHeight;
const init = (el: HTMLElement) => {
    const initEnvironmentMap = () => {
        // textureLoader = new THREE.TextureLoader().setPath("./textures/");
        envmapLoader = new THREE.CubeTextureLoader().setPath("./textures/cubeMaps/");
        const urlMapArray = new Array(6).fill('').map((item, index) => (index + 1) + '.jpg');
        envmapLoader.load(urlMapArray, map => {
            map.mapping = THREE.CubeRefractionMapping;
            scene.background = map;
            scene.environment = map;
        })

    }
    const initRenderer = () => {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        const { width, height } = el.getBoundingClientRect();
        renderer.setSize(width, height);
        // renderer.setClearColor("#404040");
        renderer.outputEncoding = THREE.sRGBEncoding;
        el.appendChild(renderer.domElement);
    }
    const initScene = () => {
        scene = new THREE.Scene();
    }
    const initCamera = () => {
        camera = new THREE.PerspectiveCamera(75, getAspect(el), 0.1, 10000);
        camera.position.set(0, 200, 300);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
    const initLight = () => {
        scene.add(new THREE.AmbientLight("#ffffff"));
        dirlight = new THREE.DirectionalLight("#ffffff", 1.0);
        dirlight.position.set(0, 200, 300);
        scene.add(dirlight);
    }
    const initModel = () => {
        GltfLoader = new GLTFLoader();
        GltfLoader.loadAsync('./model/model.glb').then(res => {
            scene.add(res.scene);
            res.scene.scale.set(1.5, 1.5, 1.5)
        })
    }
    const initControls = () => {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
    }
    const initSatats = () => {
        stats = Stats();
        el.appendChild(stats.domElement);
    }
    const animate = () => {
        renderer.render(scene, camera);
        controls.update();
        animateId = requestAnimationFrame(animate)
    }
    const resizeEvent = (e: Event) => {
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.aspect = getAspect(el);
            camera && camera.updateProjectionMatrix();
        }
        renderer.setSize(el.clientWidth, el.clientHeight)
    }
    const onWindowResize = () => {
        window.addEventListener("resize", resizeEvent)
    }
    const dispose = () => {
        track.trackByScene(scene);
        window.removeEventListener("resize", resizeEvent);
        try {
            scene.clear();
            track && track.allDisTrack();
            renderer.dispose();
            renderer.forceContextLoss();
            (renderer.context as any) = null;
            cancelAnimationFrame(animateId)
            let gl = renderer.domElement.getContext('webgl');
            gl && gl.getExtension("WEBGL_lose_context");
            el.removeChild(renderer.domElement);
            el.removeChild(stats.domElement);
        } catch (e) {
            console.log(e)
        }
    }
    const draw = () => {
        initRenderer();
        initScene();
        initCamera();
        initLight();
        initModel();
        initControls();
        initSatats();
        initEnvironmentMap();
        onWindowResize();
        animate();
    }
    const info = () => {
        console.log(renderer.info)
        console.log(track.info())
    }
    return {
        onWindowResize: onWindowResize,
        dispose: dispose,
        draw: draw,
        info: info,
        scene: scene
    }
}
export default init;

