import * as THREE from 'three'
import Main from '../../Main';
import ShaderLib from '../../libs/ShaderLib'

export interface ICityStreamLine {
    flyLineSpeed?: number;
    pointCount?: number;
    flyLineCount?: number;
    flyLineSize?: number;
    flyLineLength?: number;
    flyLineColor?: THREE.Color;
    flyLineBackgroudColor?: THREE.Color;
    flyLineStyle?: 0.0 | 0.1 | 0.2;
    name?: string
}
type T_cityStreamLineManage = Map<string, THREE.Group>;
type T_BaseState = Map<string, Record<string, any>>;
type T_lineGroupType = "路" | "地铁" | "隧道" | "通道" | "大道"
type T_singleLine = { name: string, data: [number, number][][] }[]
type T_drawData = { type: T_lineGroupType, value: T_singleLine };
/**
 * @渐隐围墙_shader特特效
 */
export default class CityStreamLine {
    time: {
        value: number
    }
    private isLoadComplete!: boolean;
    public ModelGroup !: THREE.Group;
    private drawData!: Map<T_lineGroupType, T_drawData>;
    private loader !: THREE.FileLoader;
    constructor(time: { value: number }) {
        this.time = time;
        this.loader = new THREE.FileLoader();
        this.drawData = new Map<T_lineGroupType, T_drawData>();
        this.loader.setResponseType('json');
        this.ModelGroup = new THREE.Group();
        this.isLoadComplete = true;
    }
    /**
     * @进行路线数据的读取
     */
    private loadlineData(type: T_lineGroupType) {
        this.isLoadComplete = false;
        return new Promise((res, rej) => {
            this.loader.loadAsync(`./json/${type}.json`).then((data: any) => {
                const data2 = data as T_drawData[];
                data2 && data2.forEach(item => {
                    item.value.length !== 0 && !this.drawData.get(item.type) && this.drawData.set(item.type, item);
                })
                this.isLoadComplete = true;
                res(this.isLoadComplete);
            }).catch(err => {
                this.isLoadComplete = true;
                res(false)
            })
        })
    }
    /**
     * 
     * @param type  "路" | "地铁" | "隧道" | "通道" | "大道"
     * @param opations 飞线配置参数
     * @param manage cityStreamLineManage
     * @param state cityStreamLineState
     * @returns 
     */
    public async createLineGroup(type: T_lineGroupType, opations: ICityStreamLine, manage: T_cityStreamLineManage, state: T_BaseState) {
        if (!this.isLoadComplete) {
            return setTimeout(() => {
                this.createLineGroup(type, opations, manage, state)
            }, 100);
        }
        if (!this.drawData.has(type)) {
            await this.loadlineData(type)
        }
        if (manage.has(type) || !this.drawData.has(type)) return;//如果未读取路线数据则返回，如果已创建则返回
        const data = this.drawData.get(type)!;
        const lineGroup = new THREE.Group();
        lineGroup.name = `${type}_Group`;
        data.value.forEach(children => {
            children.data.forEach(child => {
                const pointArray: number[] = [];
                child.forEach(e => {
                    const { x, y } = Main.MathLib.lon2xy(e[0], e[1]);
                    pointArray.push(x, y, 0);
                })
                if (pointArray.length > 4) {
                    const line = this.creatFlyLine(pointArray, { name: children.name, ...opations });
                    lineGroup.add(line)

                }
            })
            this.ModelGroup.add(lineGroup)
            manage.set(type, lineGroup)
            state.set(type, {})
        })


    }
    private createLine(data: number[], color: THREE.Color | string = "#006666", name: string): THREE.Line {
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
    private creatFlyLine(pointArray: number[], options: ICityStreamLine): THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> {
        const { flyLineSpeed = 1.0, pointCount = 10000, flyLineCount = 1.0, flyLineSize = 1.0, flyLineLength = 0.04, flyLineColor = new THREE.Color(69 / 255, 161 / 255, 218 / 255), flyLineBackgroudColor = new THREE.Color(24 / 255, 50 / 255, 85 / 255), flyLineStyle = 0.0, name = "" } = options;
        const vector3Array: THREE.Vector3[] = [];
        for (let i = 0, len = pointArray.length; i < len; i += 3) {
            vector3Array.push(new THREE.Vector3(pointArray[i], pointArray[i + 1], pointArray[i + 2]));
        }

        const pointArray2 = new THREE.CatmullRomCurve3(vector3Array).getSpacedPoints(pointCount);
        const geometry = new THREE.BufferGeometry();
        const percent = new Float32Array(pointArray2.length);
        for (let i = 0, len = pointArray2.length; i < len; i++) {
            percent.set([i / len], i);
        }
        geometry.setFromPoints(pointArray2);
        geometry.setAttribute("a_Percent", new THREE.BufferAttribute(percent, 1))
        geometry.computeVertexNormals();

        this.time.value += Math.random() * 400;
        const material = new THREE.ShaderMaterial({
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
                    value: flyLineColor
                },
                u_BackColor: {
                    value: flyLineBackgroudColor
                },
                u_Flag: {
                    value: flyLineStyle
                }
            }
        })
        const flyline = new THREE.Points(geometry, material);
        name && (flyline.name = name);

        return flyline;
    }
    public updateParams(manage: T_cityStreamLineManage, options: ICityStreamLine) {
        const { flyLineSpeed = 1.0, flyLineCount = 1.0, flyLineSize = 1.0, flyLineLength = 0.04, flyLineColor = new THREE.Color(69 / 255, 161 / 255, 218 / 255), flyLineBackgroudColor = new THREE.Color(24 / 255, 50 / 255, 85 / 255), flyLineStyle = 0.0} = options;
        const values = manage.values();
        for (let value of values) {
            value.children.forEach((child: any) => {
                if (child instanceof THREE.Points && child.material instanceof THREE.ShaderMaterial) {
                    child.material.uniforms.u_Number.value = flyLineCount;
                    child.material.uniforms.u_Size.value = flyLineSize;
                    child.material.uniforms.u_Speed.value = flyLineSpeed;
                    child.material.uniforms.u_Length.value = flyLineLength;
                    child.material.uniforms.u_Color.value = flyLineColor;
                    child.material.uniforms.u_BackColor.value = flyLineBackgroudColor;
                    child.material.uniforms.u_Flag.value = flyLineStyle;
                }
            })
        }
    }

    dispose() {
        this.drawData.clear();
    }


}