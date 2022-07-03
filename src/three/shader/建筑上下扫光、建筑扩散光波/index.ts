import * as THREE from 'three'
import Main from '../../Main';

export interface IBuildingSpecialEffects {
    Speed?: number;//?速度
    Opacity?: number;//?透明度
    diffuseColor?: THREE.Color;//?楼房颜色
    scanRegion?: number;//?建筑扫描效果范围
    scanColor?: THREE.Color;//?扫描带颜色
    spreadRegion?: number;//?建筑扩散效果范围
    spreadSize?: number;//?建筑扩散范围
    spreadColor?: THREE.Color;//?扩散带颜色
}
/**
 * @建筑上下扫光、建筑扩散光波_shader特效
 */
export default class BuildingSpecialEffects {
    time: {
        value: number
    }
    material!: THREE.ShaderMaterial;
    public ModelGroup !: THREE.Group;
    constructor(time: { value: number }) {
        this.time = time;
        this.ModelGroup = new THREE.Group();
    }
    useSpecialEffectComposer(ModelGroup: Map<string, THREE.Mesh>, options: IBuildingSpecialEffects) {
        const { Speed = 0.3, Opacity = 0.7, diffuseColor = new THREE.Color("#06090A"), scanRegion = 0.3, scanColor = new THREE.Color("#01c3ff"), spreadRegion = 800, spreadSize = 11000, spreadColor = new THREE.Color("#ffffff"), } = options;
        this.material = new THREE.ShaderMaterial({
            vertexShader: Main.ShaderLib.BuildingSpecialEffects.vs,
            fragmentShader: Main.ShaderLib.BuildingSpecialEffects.fs,
            uniforms: {
                ...THREE.ShaderLib.physical.uniforms,
                u_Time: this.time,
                u_BuildColor: {
                    value: diffuseColor
                },
                u_ScanColor: {
                    value: scanColor
                },
                u_ScanRegion: {
                    value: scanRegion
                },
                u_Speed: {
                    value: Speed
                },
                u_Opacity: {
                    value: Opacity
                },
                u_SpreadRegion: {
                    value: spreadRegion
                },
                u_SpreadSize: {
                    value: spreadSize
                },
                u_SpreadColor: {
                    value: spreadColor
                }
            },
            transparent: true,
        })
        ModelGroup.get(`city_1`)!.material = this.material
        ModelGroup.get(`city_2`)!.material = this.material
        ModelGroup.get(`city_3`)!.material = this.material
        ModelGroup.get(`city_4`)!.material = this.material
        ModelGroup.get(`city_5`)!.material = this.material
        ModelGroup.get(`city_6`)!.material = this.material
        ModelGroup.get(`city_7`)!.material = this.material
    }
}