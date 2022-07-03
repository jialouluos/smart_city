import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'

// import Main from '../../Main';

export interface IWaterWave {

    name?: string
}
/**
 * @水波_shader特特效
 */
export default class WaterWave {
    time: {
        value: number
    }
    material!: THREE.ShaderMaterial;
    public ModelGroup !: THREE.Group;
    constructor(time: { value: number }) {
        this.time = time;
        this.ModelGroup = new THREE.Group();
    }
    useSpecialEffectComposer(mesh: THREE.Mesh, options: IWaterWave, scene: THREE.Scene) {
        const water = new Water(
            mesh.geometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('img/waternormals.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 5,
                fog: scene.fog !== undefined
            }
        );
        mesh.parent?.remove(mesh)
        scene.add(water)
        water.material.uniforms['time'] = this.time
        // this.material = new THREE.ShaderMaterial({
        //     vertexShader: Main.ShaderLib.WaterWave.vs,
        //     fragmentShader: Main.ShaderLib.WaterWave.fs,
        //     uniforms: {
        //         ...THREE.ShaderLib.physical.uniforms,
        //         u_Time: this.time,
        //     },
        //     // wireframe: true,
        //     transparent: true,
        // })
        // this.material.lights = true;
        // mesh.material = this.material;
        // this.material.uniforms.diffuse.value = new THREE.Color("#00ffff");
    }
}