import * as THREE from 'three'
import gsap from 'gsap'

export default class TweenManage {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    tweenManage: Map<string, gsap.core.Tween>;
    container!: HTMLDivElement;
    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, container: HTMLDivElement) {
        this.scene = scene;
        this.camera = camera;
        this.container = container;
        this.tweenManage = new Map()
    }
    loadCameraRotation = (radius: number, translate: THREE.Vector2) => {
        const PraData = {
            z: 0, x: 0,
        }
        const tween = gsap.to(PraData, {
            z: 2 * Math.PI, x: 2 * Math.PI, duration: 9, repeat: -1, ease: "none", onUpdate: () => {
                this.camera.position.z = Math.sin(PraData.z) * radius + translate.x;
                this.camera.position.x = Math.cos(PraData.x) * radius + translate.y;
                this.camera.lookAt(0, 0, 0)
            }
        })
        this.tweenManage.set("CameraRotation", tween);
        this.bindDisposeCameraRotationEvent();
    }
    bindDisposeCameraRotationEvent = () => {
        this.container.addEventListener("mousedown", this.disposeCameraRotation)
    }
    disposeCameraRotation = () => {
        this.tweenManage.get("CameraRotation")?.kill();
    }
}