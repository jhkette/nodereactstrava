import React, { useContext } from 'react';
import { Route, Navigate, Outlet} from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const {auth, setAuth} = useAuth()

    return auth ? <Outlet /> : <Navigate to="/" />;

}

export default ProtectedRoute;