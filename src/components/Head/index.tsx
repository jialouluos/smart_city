import React, { Fragment } from 'react'
import style from './index.module.scss';
export default function Head() {
    return (
        <Fragment >
            <div className={style.head_box}>
                <div className={style.title_box}>
                    <h1>
                        智慧城市可视化平台
                    </h1>
                </div>

            </div>

        </Fragment>
    )
}
