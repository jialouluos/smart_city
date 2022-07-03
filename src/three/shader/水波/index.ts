import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'
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
    public ModelGroup !: THREE.Group;//用来储存线的Group
    constructor(time: { value: number }) {
        this.time = time;
    }
    useSpecialEffectComposer(mesh: THREE.Mesh, options: IWaterWave, scene: THREE.Scene) {
        const water = new Water(
            mesh.geometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('textures/waternormals.jpg', function (texture) {
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
    }
}