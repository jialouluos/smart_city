import React, { useRef, useEffect } from 'react'
import style from './index.module.scss'
import City from '../../../three/three'

export default function Canvas() {
    const CanvasRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!CanvasRef.current || !CanvasRef) return;
        const city = new City(CanvasRef.current!, true);
        city.init();
        return () => {
            console.log("即将销毁ing");
            city.dispose();
        }
    }, [CanvasRef])

    return (
        <div className={style.canvas_box} ref={CanvasRef}>
        </div>

    )
}
