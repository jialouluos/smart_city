import React, { useRef, useEffect, useState } from 'react'
import style from './index.module.scss'
import City from '../../../three/three'
import { ICanvasControlsParams } from '../index'
interface IProps {
    CanvasParams: ICanvasControlsParams
}
export default function Canvas(props: IProps) {
    const { CanvasParams } = props;
    const [city, setcity] = useState<City>()
    const CanvasRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!CanvasRef.current || !CanvasRef) return;
        const city = new City(CanvasRef.current!, true)
        setcity(city)
        city && city.init();
        city && city.ParamsControlManage.init(CanvasParams)
        return () => {
            console.log("即将销毁ing");
            city!.dispose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [CanvasRef])

    useEffect(() => {
        if (!CanvasRef.current || !CanvasRef) return;
        
        const { type, ...params } = CanvasParams;
        city?.ParamsControlManage.paramsUpdate({ ...params }, { type }, city)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [CanvasParams])

    return (
        <div className={style.canvas_box} ref={CanvasRef}>
        </div>

    )
}
