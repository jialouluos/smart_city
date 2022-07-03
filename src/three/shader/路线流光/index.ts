import * as THREE from 'three'
import ShaderLib from '../../libs/ShaderLib'
import City from '../../three';
import type { T_CityStreamLineManage, T_LineGroupType, T_CityStreamLineState } from '../../manages/SpecialEffectsManage'
//?创建实例时的一些配置参数
export interface ICityStreamLine {
    flyLineSpeed?: number;//?飞点速度
    pointCount?: number;//?细分点数量
    flyLineCount?: number;//?飞点数量
    flyLineSize?: number;//?飞点大小
    flyLineLength?: number;//?飞线长度
    color?: THREE.Color;//?飞线颜色
    name?: string;//?标识
}

/**
 * @路线流光_shader特效
 */
export default class CityStreamLine {
    private time: {
        value: number
    }
    private isLoadComplete!: boolean;//用来记录当前是否正在加载数据
    public ModelGroup !: THREE.Group;//用来储存线的Group
    constructor(time: { value: number }) {
        this.time = time;
        this.ModelGroup = new THREE.Group();
        this.ModelGroup.name = "lineGroup";
        this.isLoadComplete = true;
    }
    /**
     * @进行路线模型的加载
     */
    private loadLineModel(type: T_LineGroupType, manage: T_CityStreamLineManage, state: T_CityStreamLineState, city: City) {
        this.isLoadComplete = false;
        return new Promise((res, rej) => {
            city.modelLoaderByDraco.loadAsync(`./model/${type}.glb`).then(glb => {
                console.log(glb);
                const model = glb.scene.children[0] as THREE.Object3D;
                (model.children[0] as THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>).material.color = state.get(type)!.color;//?由于是材质共用所以只需要将第一个网格颜色改变就行
                this.isLoadComplete = true;
                manage.set(type, model);
                state.set(type, { ...state.get(type), flylineGroupIsEmpty: true });
                const flyLineGroup = new THREE.Group();
                flyLineGroup.name = `flyLineGroup_${type}`
                model.add(flyLineGroup);
                this.ModelGroup.add(model)
                this.setLayers(model, 1)
                res(true);
            }).catch(err => {
                this.isLoadComplete = true;
                console.log(err, "in 路线流光");
                rej(false)
            })
        })
    }
    /**
     *
     * @param type  "路" | "地铁" | "隧道" |  "大道"
     * @param opations 飞线配置参数
     * @param manage cityStreamLineManage
     * @param state cityStreamLineState
     * @param style "实线" | "飞线" | "融合"
     * @param city City
     * @returns null
     */
    public async createLineGroup(type: T_LineGroupType, opations: ICityStreamLine, manage: T_CityStreamLineManage, state: T_CityStreamLineState, style: "实线" | "飞线" | "融合", city: City) {
        //?如果数据读取未完成，则延时重新调用
        if (!this.isLoadComplete) {
            return setTimeout(() => {
                this.createLineGroup(type, opations, manage, state, style, city)
            }, 100);
        }
        //?如果不存在该类型数据，则尝试导入读取
        if (!manage.has(type)) {
            const flag = await this.loadLineModel(type, manage, state, city);//!flag记录该次读取是否成功
            if (!flag) {//!如果读取失败，尝试重新再读取一次
                const reflag = await this.loadLineModel(type, manage, state, city);
                if (!reflag) return;//!如果读取失败则直接结束函数
            }
        }

        console.log(manage);
        state.set("current", { style })
        if (style === "实线") {
            if (state.has(type) && state.get(type)!.style === "实线") {
                //?如果为实线，则表明现在已经处于实线状态了，那需要动态改变他的层级
                this.setLayers(manage.get(type)!, manage.get(type)!.layers.mask & 1 ? 1 : 0);//?先将全部元素设置为0层
            } else {
                this.setLayers(manage.get(type)!, 0);//?先将全部元素设置为0层
            }
            //?如果存在飞线，则需要将飞线销毁
            if (!state.get(type)!.flylineGroupIsEmpty && manage.get(type)?.getObjectByName(`flyLineGroup_${type}`)) {
                console.log("创建了一个新的flylinegroup  in 实线里");
                city.track.track(manage.get(type)?.getObjectByName(`flyLineGroup_${type}`));
                city.track.disTrackByGroup(manage.get(type)!.getObjectByName(`flyLineGroup_${type}`)! as THREE.Group);
                //?重新创建一个飞线组
                const flyLineGroup = new THREE.Group();
                flyLineGroup.name = `flyLineGroup_${type}`
                flyLineGroup.layers.set(manage.get(type)!.layers.mask & 1 ? 0 : 1);
                manage.get(type)!.add(flyLineGroup);
                state.get(type)!.flylineGroupIsEmpty = true;//更新飞线组状态
            }
        }
        else {
            const group = manage.get(type)?.getObjectByName(`flyLineGroup_${type}`)!;
            if (state.get(type)!.flylineGroupIsEmpty) {//?如果飞线组为空，则需要创建

                (manage.get(type)?.children as THREE.LineSegments[]).forEach((item) => {
                    if (item.type === "LineSegments") {
                        group.add(this.creatFlyLine(item.geometry.attributes.position.array, { name: item.name, ...opations }))
                    }
                })
                state.get(type)!.flylineGroupIsEmpty = false;
            }
            if (style === "融合") {
                if (state.has(type) && state.get(type)!.style === "融合") {
                    //?如果为融合，则表明现在已经处于融合状态了，那需要动态改变他的层级
                    this.setLayers(manage.get(type)!, manage.get(type)!.layers.mask & 1 ? 1 : 0)
                } else {
                    this.setLayers(manage.get(type)!, 0)
                }
            } else {
                const layer = group.layers.mask;
                this.setLayers(manage.get(type)!, 1)//?先将全部元素设置为1层
                if (state.has(type) && state.get(type)!.style === "飞线") {
                    //?如果为飞线，则表明现在已经处于飞线状态了，那需要动态改变他的层级
                    !(layer & 1) && this.setLayers(group, 0);//?再将飞线组设为0层
                } else {
                    this.setLayers(group, 0);
                }

            }
        }
        state.set(type, { ...state.get(type), style })
    }
    //?创建飞线
    private creatFlyLine(pointArray: ArrayLike<number>, options: ICityStreamLine): THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> {
        let { flyLineSpeed = 0.16, pointCount = 10000, flyLineCount = 1.0, flyLineSize = 4, flyLineLength = 0.04, color = new THREE.Color(69 / 255, 161 / 255, 218 / 255), name = "" } = options;
        const vector3Array: THREE.Vector3[] = [];
        for (let i = 0, len = pointArray.length; i < len; i += 3) {
            vector3Array.push(new THREE.Vector3(pointArray[i], pointArray[i + 1], pointArray[i + 2]));
        }
        flyLineCount = flyLineCount + Math.floor((pointArray.length) / 250);
        flyLineLength *= pointCount / pointArray.length * 0.06;
        flyLineSpeed *= pointCount / pointArray.length * 0.05;
        const flyLineMaterial = new THREE.ShaderMaterial({
            vertexShader: ShaderLib.CityStreamLine.vs,
            fragmentShader: ShaderLib.CityStreamLine.fs,
            uniforms: {
                u_Time: this.time,
                u_Number: {
                    value: flyLineCount
                },
                u_Size: {
                    value: flyLineSize
                },
                u_Speed: {
                    value: flyLineSpeed
                },
                u_Length: {
                    value: flyLineLength
                },
                u_Color: {
                    value: color
                }
            }
        })
        const pointArray2 = new THREE.CatmullRomCurve3(vector3Array).getSpacedPoints(pointCount);
        const geometry = new THREE.BufferGeometry();
        const percent = new Float32Array(pointArray2.length);
        for (let i = 0, len = pointArray2.length; i < len; i++) {
            percent.set([i / len], i);
        }
        geometry.setFromPoints(pointArray2);
        geometry.setAttribute("a_Percent", new THREE.BufferAttribute(percent, 1))
        geometry.computeVertexNormals();
        const flyline = new THREE.Points(geometry, flyLineMaterial);
        name && (flyline.name = name);
        return flyline;
    }
    //?更新飞线参数
    public updateParams(type: T_LineGroupType, manage: T_CityStreamLineManage, state: T_CityStreamLineState, options: ICityStreamLine) {
        const { flyLineSpeed = 0.16, flyLineCount = 1.0, flyLineSize = 4, flyLineLength = 0.04, color = new THREE.Color(69 / 255, 161 / 255, 218 / 255) } = options;
        if (!manage.has(type) && !(state.has(type) && !state.get(type)!.isFlyLineGroupIsEmpty)) return;
        const model = manage.get(type)?.getObjectByName(`flyLineGroup_${type}`);
        model?.children.forEach(child => {
            if (child instanceof THREE.Points && child.material instanceof THREE.ShaderMaterial) {
                child.material.uniforms.u_Number.value = flyLineCount;
                child.material.uniforms.u_Size.value = flyLineSize;
                child.material.uniforms.u_Speed.value = flyLineSpeed;
                child.material.uniforms.u_Length.value = flyLineLength;
                child.material.uniforms.u_Color.value = color;
            }
        })
    }
    //?将一整个组的成员的层级都进行统一设置
    private setLayers(group: THREE.Object3D, layer: number) {
        group.layers.set(layer)
        group.children.length > 0 && group.children.forEach((child: THREE.Object3D & { geometry?: THREE.BufferGeometry, material?: THREE.LineBasicMaterial | THREE.ShaderMaterial }) => {
            if (child.type === "LineSegments" || child.type === "Points") {
                child.layers.set(layer);
            } else if (child.type === "Group") {
                this.setLayers(child as THREE.Group, layer)
            }
        })
    }
}