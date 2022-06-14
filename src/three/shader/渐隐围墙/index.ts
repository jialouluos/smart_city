import * as THREE from 'three'
import ShaderLib from '../../libs/ShaderLib'

interface IRecedingFence {
    scale?: number,
    u_a?: number,
    u_b?: number,
    u_n?: number,
    speed?: number,
    animateFlag?: boolean,
    height?: number,
    color?: THREE.Color | string,
    name: string
}
/**
 * @渐隐围墙_shader特特效
 */
export default class RecedingFence {
    time: {
        value: number
    }
    constructor(time: { value: number },) {
        this.time = time;
    }
    createMesh(data: number[], option: IRecedingFence = { scale: 1.3, u_a: 0, u_b: 0, u_n: 2.8, speed: 1.0, animateFlag: false, height: 8, color: new THREE.Color("#ff0000"), name: "" }) {
        const geometry = new THREE.BufferGeometry();
        let { scale, u_a, u_b, u_n, speed, animateFlag, height, color, name } = option;
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
        if (points.length < 3) return;
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
        mesh.name = name;
        return mesh

    }
}