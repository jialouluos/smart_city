import React, { useState } from 'react'
import CanvasControls from './CanvasControls'
import DataDisplay from './DataDisplay'
import style from './index.module.scss'
import { ICanvasControlsParams } from '../index'
interface IProps {
    setCanvasParams: React.Dispatch<React.SetStateAction<ICanvasControlsParams>>
    CanvasParams: ICanvasControlsParams
}
export default function RightSanBox(props: IProps) {
    const { setCanvasParams, CanvasParams } = props;
    const [State, setState] = useState(true)
    return (
        <div className={style.right_box}>
            
            <div className={style.display_box}>
                {State ? <CanvasControls setCanvasParams={setCanvasParams} CanvasParams={CanvasParams} /> : <DataDisplay />}
            </div>
            {State ? <button onClick={() => { setState(false) }} className={style.select_botton}>可视化面板</button> : <button onClick={() => { setState(true) }} className={style.select_botton}>canvas控制面板</button>}
        </div>
    )
}
