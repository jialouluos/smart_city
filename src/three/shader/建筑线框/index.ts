import * as THREE from 'three'
/**
 * @建筑线框
 */
interface IBuildWireframe {
    height?: number;
    color?: THREE.Color;
    angle?: number;
}
export default class BuildWireframe {
    time: {
        value: number
    }
    material!: THREE.LineBasicMaterial;
    public ModelGroup !: THREE.Group;//用来储存线的Group
    constructor(time: { value: number }) {
        this.time = time;
        this.material = new THREE.LineBasicMaterial({
            color: new THREE.Color("#31deef"),
        });
    }
    useSpecialEffectComposer(mesh: THREE.Mesh, opations: IBuildWireframe, scene: THREE.Scene) {
        const { angle = 1, color = new THREE.Color("#31deef"), height = 50 } = opations;
        this.material.color = color;
        const vertextArray = [];
        const thresholdDot = Math.cos(angle * Math.PI / 180);
        const indexAttr = mesh.geometry.getIndex();//顶点索引数组
        const positionAttr = mesh.geometry.getAttribute('position');
        const indexArr = [0, 0, 0];
        const _triangle: ['a', 'b', 'c'] = ['a', 'b', 'c'];
        const indexCount = indexAttr ? indexAttr.count : positionAttr.count;
        const normal = new THREE.Vector3(0, 0, 0)
        const normalMap = new Map<string, { v1: THREE.Vector3, v2: THREE.Vector3, normal: THREE.Vector3 } | null>();//记录法向，去除多余三角面
        for (let i = 0; i < indexCount; i += 3) {
            if (indexAttr) {
                //得到position数组的下标
                indexArr[0] = indexAttr.getX(i);
                indexArr[1] = indexAttr.getY(i);
                indexArr[2] = indexAttr.getZ(i);
            } else {
                //得到position数组的下标
                indexArr[0] = i;
                indexArr[1] = i + 1;
                indexArr[2] = i + 2;
            }
            const triangle = new THREE.Triangle();
            const { a, b, c } = triangle;
            a.fromBufferAttribute(positionAttr, indexArr[0]);//面上a点
            b.fromBufferAttribute(positionAttr, indexArr[1]);//面上b点
            c.fromBufferAttribute(positionAttr, indexArr[2]);//面上c点
            triangle.getNormal(normal);
            if (a.z > height || b.z > height || c.z > height) {
                for (let i = 0; i < 3; i++) {
                    let nexti = (i + 1) % 3;
                    const v1 = triangle[_triangle[i]];
                    const v2 = triangle[_triangle[nexti]];
                    const id = `${v1.x},${v1.y},${v1.z}->${v2.x},${v2.y},${v2.z}`
                    const nid = `${v2.x},${v2.y},${v2.z}->${v1.x},${v1.y},${v1.z}`
                    if (normalMap.has(nid) && normalMap.get(nid)) {//这里取反与绘制方式有关，如果当前是id方向绘制(逆时针)，那么跟他同轴的合理绘制方式只能以nid的方式绘制(逆时针)
                        if (normal.dot(normalMap.get(nid)!.normal) <= thresholdDot) {//这里是将同轴边添加进顶点数组中，如果是一个立方体，那么每一条边都是同轴边，就不存在不匹配边
                            vertextArray.push(...v1.toArray().flat())
                            vertextArray.push(...v2.toArray().flat())
                        }
                        normalMap.set(nid, null)
                    } else if (!(normalMap.has(id))) {
                        normalMap.set(id, {
                            v1: v1.clone(),
                            v2: v2.clone(),
                            normal: normal.clone(),
                        });
                    }
                }
            }
        }
        // const values = normalMap.values();//由于我们场景需要线框的物体全是立方体建筑，所以剩余的不匹配边就不用添加进顶点数组，在效果不变的同时大大节约了性能
        // for (let value of values) {
        //     if (!!value) {
        //         const { v1, v2 } = value;
        //         vertextArray.push(...v1.toArray().flat())
        //         vertextArray.push(...v2.toArray().flat())
        //     }
        // }
        const buffgeometry = new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(vertextArray, 3));
        var line = new THREE.LineSegments(buffgeometry, this.material);
        line.rotation.x -= Math.PI * 0.5;
        line.scale.set(0.1, 0.1, 0.1);
        scene.add(line)
    }
}



