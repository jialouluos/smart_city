import React, { useRef, useEffect } from 'react'
import style from './index.module.scss'
import * as  THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
let renderer!: THREE.WebGLRenderer;
let camera!: THREE.PerspectiveCamera;
let scene!: THREE.Scene;
// let textureLoader!: THREE.TextureLoader;
let dirlight!: THREE.DirectionalLight;
let controls!: OrbitControls;
let stats!: Stats;
export default function Canvas() {
    const CanvasRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const getAspect = (el: HTMLElement): number => el.clientWidth / el.clientHeight;
        const initRenderer = () => {
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            const { width, height } = CanvasRef.current!.getBoundingClientRect();
            renderer.setSize(width, height);
            renderer.setClearColor("#404040");
            renderer.outputEncoding = THREE.sRGBEncoding;
            CanvasRef.current?.appendChild(renderer.domElement);
        }
        const initScene = () => {
            scene = new THREE.Scene();
        }
        const initCamera = () => {
            camera = new THREE.PerspectiveCamera(75, getAspect(CanvasRef.current!), 0.1, 1000);
            camera.position.set(0, 200, 300);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
        const initLight = () => {
            scene.add(new THREE.AmbientLight("#ffffff"));
            dirlight = new THREE.DirectionalLight("#ffffff", 1.0);
            dirlight.position.set(0, 200, 300);
            scene.add(dirlight);
        }
        const initControls = () => {
            controls = new OrbitControls(camera, renderer.domElement);
            controls.update();
        }
        const initSatats = () => {
            stats = Stats();
            CanvasRef.current?.appendChild(stats.domElement);
        }
        const animate = () => {
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
                controls.update();
            })
        }
        const resizeEvent = (e: Event) => {
            if (camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = getAspect(CanvasRef.current!);
                camera && camera.updateProjectionMatrix();
            }
            renderer.setSize(CanvasRef.current!.clientWidth, CanvasRef.current!.clientHeight)
        }
        const initModel = () => {
            const geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
            const material = new THREE.MeshStandardMaterial({ color: "#ff0000" })
            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);
        }
        const onWindowResize = () => {
            window.addEventListener("resize", resizeEvent)
        }
        const dispose = () => {
            window.removeEventListener("resize", resizeEvent);
        }
        const draw = () => {
            initRenderer();
            initScene();
            initCamera();
            initLight();
            initModel();
            initControls();
            initSatats();

            onWindowResize();
            animate();
        }
        if (CanvasRef && CanvasRef.current) {
            draw();
        }
        return () => {
            console.log("销毁了")
            dispose()
        }
    }, [CanvasRef])

    return (
        <div className={style.canvas_box} ref={CanvasRef}></div>
    )
}
