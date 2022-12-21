import React, { useEffect } from 'react';
import Chameleon from '../Chameleon'
import { useLocation, Outlet } from 'react-router-dom';
export default function Home() {
    const location = useLocation();

    useEffect(()  => {
        console.log("fromhome", location);
    }, [location]);

    return (<>
    <Outlet />
    </>);
}