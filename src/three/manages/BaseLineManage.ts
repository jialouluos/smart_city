import * as THREE from 'three'
import Main from '../Main'
type T_lineGroupType = "路" | "地铁" | "隧道" | "通道" | "大道"
type T_singleLine = { name: string, data: [number, number][][] }[]
type T_lineData = { type: T_lineGroupType, value: T_singleLine };
/**
* @负责线数据的加载和分类
*/
export default class BaseLineManage {
    private isLoadComplete!: boolean;
    private lineData!: Map<T_lineGroupType, T_lineData>;
    private loader !: THREE.FileLoader;
    public lineGroups!: Map<T_lineGroupType, THREE.Group>;
    public lineStates!: Map<T_lineGroupType, Record<string, any>>;
    public lineTypes: ["路", "地铁", "隧道", "通道", "大道"];
    constructor() {
        this.loader = new THREE.FileLoader();
        this.lineData = new Map<T_lineGroupType, T_lineData>();
        this.lineGroups = new Map<T_lineGroupType, THREE.Group>();
        this.lineStates = new Map<T_lineGroupType, Record<string, any>>();
        this.loader.setResponseType('json');
        this.lineTypes = ["路", "地铁", "隧道", "通道", "大道"];
        this.isLoadComplete = false;
    }
    init() {
        this.loadlineData();
    }
    loadlineData() {
        this.loader.loadAsync("./json/all.json").then((res: any) => {
            const data = res as T_lineData[];
            data.forEach(item => this.lineData.set(item.type, item))
            this.isLoadComplete = true;
        })
    }
    createLineGroup(type: T_lineGroupType) {
        if (!this.isLoadComplete) return setTimeout(() => {
            this.createLineGroup(type)
        }, 100);
        const data = this.lineData.get(type)!;
        const lineGroup = new THREE.Group();
        lineGroup.name = `${type}_Group`;
        data.value.forEach(children => {
            children.data.forEach(child => {
                const pointArray: number[] = [];
                child.forEach(e => {
                    const { x, y } = Main.MathLib.lon2xy(e[0], e[1]);
                    pointArray.push(x, y, 0);
                })
                const line = this.createLine(pointArray, "#ffff00", children.name);
                lineGroup.add(line);
            })
        })
        this.lineGroups.set(type, lineGroup);
        this.lineStates.set(type, { name: type })
    }
    createLine(data: number[], color: THREE.Color | string = "#006666", name: string): THREE.Line {
        typeof color === "string" && (color = new THREE.Color(color));
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data), 3));
        const material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
        });
        const line = new THREE.Line(geometry, material) as (THREE.Line & { defaultColor?: THREE.Color, preColor?: THREE.Color }); //线条模型对象
        line.defaultColor = color;//供后续使用的颜色
        line.preColor = color;//用来后续记录改变的颜色
        line.name = name;
        return line;
    }
    dispose() {
        this.lineData.clear();
        this.lineStates.clear();
        this.lineGroups.clear();
        
    }


}