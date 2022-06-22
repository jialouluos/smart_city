import React, { useState } from 'react'
import Head from '../../components/Head';
import Canvas from './Canvas';
import LeftSanBox from './LeftSanBox';
import RightSanBox from './RightSanBox';
type T_lineGroupType = "路" | "地铁" | "隧道" | "通道" | "大道";
type T_RouteStyle = "实线" | "飞线" | "融合";
type T_Type = "route" | "region" | "style" | "";
export interface ICanvasControlsParams {
    routeType: T_lineGroupType
    regionType: string
    type: T_Type
    routeStyle: T_RouteStyle
}
export default function SandBox() {
    const [CanvasParams, setCanvasParams] = useState<ICanvasControlsParams>({
        routeType: '路',
        regionType: "区域一",
        routeStyle: "实线",
        type: "",
    })

    return (
        <div>
            <Head></Head>
            <div style={{ height: '100vh' }}>
                <LeftSanBox></LeftSanBox>
                <Canvas CanvasParams={CanvasParams}></Canvas>
                <RightSanBox setCanvasParams={setCanvasParams} CanvasParams={CanvasParams}></RightSanBox>
            </div>
        </div >

    )
}
