import * as THREE from 'three'
import { vertex } from './vertexShader'
import { fragment } from './fragmentShader'
export default class RecedingFence {
    Params!: Record<string, any>
    time: {
        value: number
    }
    geometry!: THREE.BufferGeometry;
    material!: THREE.ShaderMaterial;
    constructor(time: { value: number }, scale: number = 1.3, u_a: number = 0, u_b: number = 0, u_n: number = 2.8, speed: number = 1.0, animateFlag: boolean = false) {
        this.Params = {
            scale,
            u_a,
            u_b,
            u_n,
            speed,
            animateFlag,
        }
        this.time = time;
    }
    // init() {
    //     this.createEvery();
    // }
    // createEvery() {
    //     const data = [0, 0,
    //         6, 0,
    //         6, 8,
    //         4, 12,
    //         2, 7,
    //         0, 0
    //     ]
    //     this.initGeometry(data, 8, new THREE.Color("#ff0000"))
    // }
    createMesh(data: number[], height: number, color: THREE.Color) {
        this.geometry = new THREE.BufferGeometry();
        const Points = [];
        const Opacity = [];
        for (let i = 2; i < data.length; i += 2) {
            const point_1 = [data[i - 2], height, data[i - 1]]
            const point_2 = [data[i - 2], 0, data[i - 1]]
            const point_3 = [data[i], 0, data[i + 1]]
            const point_4 = [data[i - 2], height, data[i - 1]]
            const point_5 = [data[i], 0, data[i + 1]]
            const point_6 = [data[i], height, data[i + 1]]
            Points.push(point_1, point_2, point_3, point_4, point_5, point_6);
            Opacity.push(1, 0, 0, 1, 0, 1)
        }
        if (Points.length < 3) return;
        this.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(Points.flat()), 3));
        this.geometry.setAttribute("a_alpha", new THREE.BufferAttribute(new Float32Array(Opacity), 1))
        this.geometry.computeVertexNormals()
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: { ...THREE.ShaderLib.lambert.uniforms, u_scale: { value: this.Params.scale }, u_a: { value: this.Params.u_a }, u_b: { value: this.Params.u_b }, u_n: { value: this.Params.u_n }, u_Time: this.time, u_Speed: { value: this.Params.speed }, u_animateFlag: { value: this.Params.animateFlag ? 1.0 : 0.0 } },
            side: THREE.DoubleSide, //两面可见
            transparent: true, //需要开启透明度计算，否则着色器透明度设置无效
            depthTest: false,
        })
        this.material.lights = true;
        this.material.uniforms.diffuse.value = color
        const mesh = new THREE.Mesh(this.geometry, this.material);
        return mesh;
    }
}