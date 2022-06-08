import React, { Suspense } from 'react'
import { Navigate } from "react-router-dom";
import { Spin } from 'antd'
function lazyLoad(Comp: React.LazyExoticComponent<any>, content?: any): React.ReactNode {
    return (
        <Suspense
            fallback={
                <Spin
                    size='large'
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />
            }
        >
            <Comp content={content} />
        </Suspense>
    )
}
interface ISandboxRouter {
    path: string,
    element: React.ReactNode;
    children?: ISandboxRouter[]
}
const routers: ISandboxRouter[] = [
    {
        path: "login",
        element: lazyLoad(React.lazy(() => import('../pages/Login'))),
    },
    {
        path: "sandbox",
        element: lazyLoad(React.lazy(() => import('../pages/SandBox'))),
    },
    {
        path: '/',
        element: <Navigate to="/sandbox" replace={true} />
    },
    {
        path: '*',
        element: lazyLoad(React.lazy(() => import('../components/NoPermission'))),
    }
]
export default routers;