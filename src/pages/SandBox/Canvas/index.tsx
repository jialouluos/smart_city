import React, { useRef, useEffect } from 'react'
import style from './index.module.scss'
import init from './three'

export default function Canvas() {
    const CanvasRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!CanvasRef.current || !CanvasRef) return;
        const ThreeManage = init(CanvasRef.current!);
        ThreeManage.draw();
        return () => {
            console.log("即将销毁ing");
            ThreeManage.dispose();
        }
    }, [CanvasRef])

    return (
        <div className={style.canvas_box} ref={CanvasRef}>
        </div>

    )
}
