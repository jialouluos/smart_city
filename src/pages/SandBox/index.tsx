import React from 'react'
// import { useNavigate } from 'react-router-dom'
import Head from '../../components/Head';
import Canvas from './Canvas';
import LeftSanBox from './LeftSanBox';
import RightSanBox from './RightSanBox';
export default function SandBox() {
    // const navigate = useNavigate();

    return (
        <div>
            <Head></Head>
            <div style={{ height: '100vh' }}>
                <LeftSanBox></LeftSanBox>
                <Canvas></Canvas>
                <RightSanBox></RightSanBox>
            </div>
        </div >

    )
}
