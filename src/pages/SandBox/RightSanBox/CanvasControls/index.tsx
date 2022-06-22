import React from 'react'
import style from './index.module.scss'
import { ICanvasControlsParams } from '../../index'
type T_lineGroupType = "路" | "地铁" | "隧道" | "通道" | "大道";
type T_RouteStyle = "实线" | "飞线" | "融合";
interface IProps {
    setCanvasParams: React.Dispatch<React.SetStateAction<ICanvasControlsParams>>
    CanvasParams: ICanvasControlsParams
}
export default function CanvasControls(props: IProps) {
    const { setCanvasParams, CanvasParams } = props;
    const routeTypes = ["路", "地铁", "隧道", "通道", "大道"];
    const routeStyle = ["实线", "飞线", "融合"]
    const regionTypes = ["区域一", "区域二", "区域三", "区域四", "区域五", "区域六"]
    return (
        <div className={style.canvas}>
            <h1>城市实况</h1>
            <div>
                <h4>城市路线</h4>
                {
                    routeTypes.map(item => {
                        return <button onClick={() => { setCanvasParams({ ...CanvasParams, routeType: item as T_lineGroupType, type: "route" }) }} key={item}>{item}</button>
                    })

                }
                {
                    routeStyle.map(item => {
                        return <button onClick={() => { setCanvasParams({ ...CanvasParams, routeStyle: item as T_RouteStyle, type: "style" }) }} key={item}>{item}</button>
                    })
                }
            </div>
            <div>
                <h4>选择区域</h4>
                {regionTypes.map(item => {
                    return <button onClick={() => { setCanvasParams({ ...CanvasParams, regionType: item, type: "region" }) }} key={item}>{item}</button>
                })}
            </div>
        </div>
    )
}
