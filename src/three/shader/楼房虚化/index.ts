import * as THREE from 'three'
import Main from '../../Main';

export interface IBuildingVirtualization {
    Speed?: number;//?速度
    Region?: number;//?特效区域范围
    Opacity?: number;//?透明度
    SpacialColor?: THREE.Color;//?增强颜色
    DiffuseColor?: THREE.Color;//?楼房颜色
}
/**
 * @楼房虚化_shader特特效
 */
export default class BuildingVirtualization {
    time: {
        value: number
    }
    material!: THREE.ShaderMaterial;
    public ModelGroup !: THREE.Group;
    constructor(time: { value: number }) {
        this.time = time;
        this.ModelGroup = new THREE.Group();
    }
    useSpecialEffectComposer(ModelGroup: Map<string, THREE.Mesh>, options: IBuildingVirtualization) {
        const { Speed = 0.4, Region = 0.3, Opacity = 0.7, SpacialColor = new THREE.Color("#01c3ff"), DiffuseColor = new THREE.Color("#06090A") } = options;
        this.material = new THREE.ShaderMaterial({
            vertexShader: Main.ShaderLib.BuildingVirtualization.vs,
            fragmentShader: Main.ShaderLib.BuildingVirtualization.fs,
            uniforms: {
                ...THREE.ShaderLib.physical.uniforms,
                u_Time: this.time,
                u_Color: {
                    value: DiffuseColor
                },
                u_boostColor: {
                    value: SpacialColor
                },
                u_Region: {
                    value: Region
                },
                u_Speed: {
                    value: Speed
                }
            },
            transparent: true,
        })
        this.material.lights = true;
        this.material.uniforms.opacity.value = Opacity;
        ModelGroup.get(`city_1_1`)!.material = this.material
        ModelGroup.get(`city_2_1`)!.material = this.material
        ModelGroup.get(`city_3_1`)!.material = this.material
        ModelGroup.get(`city_4_1`)!.material = this.material
        ModelGroup.get(`city_5_1`)!.material = this.material
        ModelGroup.get(`city_6_1`)!.material = this.material
        ModelGroup.get(`build`)!.material = this.material
    }
}