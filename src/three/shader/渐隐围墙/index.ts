import * as THREE from 'three'
import ShaderLib from '../../libs/ShaderLib'
import CityStaticDataLib from '../../libs/CityStaticDataLib'

export  interface IRecedingFence {
    scale?: number,
    u_a?: number,
    u_b?: number,
    u_n?: number,
    speed?: number,
    animateFlag?: boolean,
    height?: number,
    color?: THREE.Color | string,
    name?: string
}
type T_BaseManage = Map<string, THREE.Mesh>;
type T_BaseState = Map<string, Record<string, any>>;
type T_Type = "region_1" | "region_2" | "region_3" | "region_4" | "region_5" | "region_6";
type T_Data = { position: [number, number, number], data: [number, number][] }
type T_drawData = T_Data;
/**
 * @渐隐围墙_shader特特效
 */
export default class RecedingFence {
    time: {
        value: number
    }
    drawData!: Map<T_Type, T_drawData>
    isLoadComplete!: boolean;
    ModelGroup!: THREE.Group;
    constructor(time: { value: number },) {
        this.time = time;
        this.drawData = new Map<T_Type, T_drawData>();
        this.isLoadComplete = true;
        this.ModelGroup = new THREE.Group();
        this.ModelGroup.name = 'regionGroup';
    }
    /**
     * @进行数据的读取
     */
    private loadData() {
        this.isLoadComplete = false;
        const data = CityStaticDataLib.recedingFence;
        data.forEach(child => {
            !this.drawData.has(child.name) && this.drawData.set(child.name, child.value);
        })
        this.isLoadComplete = true;
    }
    /**
     * 
     * @param type  "region_1" | "region_2" | "region_3" | "region_4" | "region_5" | "region_6"
     * @param opations 配置参数
     * @param manage recedingFenceManage
     * @param state recedingFenceStates
     * @returns 
     */
    public createRegionGroup(type: T_Type, opations: IRecedingFence, manage: T_BaseManage, state: T_BaseState) {
        if (!this.isLoadComplete) {
            return setTimeout(() => {
                this.createRegionGroup(type, opations, manage, state)
            }, 100);
        }
        if (!this.drawData.has(type)) {
            this.loadData()
        }
        if (manage.has(type) || !this.drawData.has(type)) return;//如果未读取路线数据则返回，如果已创建则返回
        const data = this.drawData.get(type)!;
        const pointArray: number[] = []
        data.data.forEach(children => {
            pointArray.push(children[0], children[1]);
        })
        if (pointArray.length > 3) {

            const model = this.createMesh(pointArray, { name: type })
            this.ModelGroup.add(model)
            manage.set(type, model)
            state.set(type, {})
        }
    }
    private createMesh(data: number[], option: IRecedingFence): THREE.Mesh {
        const geometry = new THREE.BufferGeometry();

        let { scale = 1.3, u_a = 0, u_b = 0, u_n = 2.8, speed = 1.0, animateFlag = false, height = 8, color = new THREE.Color("#ff0000"), name = "" } = option;
        const points = [];
        const uv = [];
        for (let i = 2; i < data.length; i += 2) {
            const point_1 = [data[i - 2], height, data[i - 1]]
            const point_2 = [data[i - 2], 0, data[i - 1]]
            const point_3 = [data[i], 0, data[i + 1]]
            const point_4 = [data[i - 2], height, data[i - 1]]
            const point_5 = [data[i], 0, data[i + 1]]
            const point_6 = [data[i], height, data[i + 1]]
            points.push(point_1, point_2, point_3, point_4, point_5, point_6);
            uv.push(0, 1, 0, 0, 1, 0);
            uv.push(0, 1, 1, 0, 1, 1);
        }
        typeof color === "string" && (color = new THREE.Color(color));

        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(points.flat() as ArrayLike<number>), 3))
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uv), 2))
        geometry.computeVertexNormals()
        const material = new THREE.ShaderMaterial({
            vertexShader: ShaderLib.RecedingEnclosure.vs,
            fragmentShader: ShaderLib.RecedingEnclosure.fs,
            uniforms: { ...THREE.ShaderLib.lambert.uniforms, u_scale: { value: scale }, u_a: { value: u_a }, u_b: { value: u_b }, u_n: { value: u_n }, u_Time: this.time, u_Speed: { value: speed }, u_animateFlag: { value: animateFlag ? 1.0 : 0.0 } },
            side: THREE.DoubleSide, //两面可见
            transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
            depthTest: false,
        })
        material.lights = true;
        material.uniforms.diffuse.value = color
        const mesh = new THREE.Mesh(geometry, material);
        name && (mesh.name = name);
        return mesh

    }
    public updateParams(manage: T_BaseManage, options: IRecedingFence) {

    }
}