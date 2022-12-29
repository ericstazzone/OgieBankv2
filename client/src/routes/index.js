import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import actions from '../redux/actions/auth';
import axios from 'axios';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Error from './Pages/Error';
import Overview from './Pages/Overview';
import Transactions from './Pages/Transactions';
import Settings from './Pages/Settings';
import Budget from './Pages/Budget';

const RestrictedRoute = ({ children, redirectTo}) => {
    const isAuth = useSelector(({auth}) => auth.auth);
    return isAuth ? children : <Navigate to={redirectTo} />
}

const AllRoutes = () => {
    const isAuth = useSelector(({ auth }) => auth.auth)
    const dispatch = useDispatch()
    useEffect(() => {
        const checkSession = async () => {
            console.log('checking session')
            const { data } = await axios.get('/api/user/session')
            if (!isAuth && !data.error) {
                console.log(data)
                dispatch(actions.loginAuthUser(data))
            }
            console.log('done checking session')
        }
        checkSession() 
    }, [dispatch, isAuth])

    return (
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path='/overview' element={
                <RestrictedRoute redirectTo={'/login'}>
                    <Overview/>
                </RestrictedRoute>
            }/>
            <Route path='/transactions' element={
                <RestrictedRoute redirectTo={'/login'}>
                    <Transactions/>
                </RestrictedRoute>
            }/>

            <Route path='/settings' element={
                <RestrictedRoute redirectTo={'/login'}>
                    <Settings />
                </RestrictedRoute>
            }/>
            
            <Route path='/budget' element={
                <RestrictedRoute redirectTo={'/login'}>
                    <Budget/>
                </RestrictedRoute>
            }/>
            
            <Route path='/' element={<Login/>}/>
            <Route path='*' element={<Error/>}/>
        </Routes>
    )
}

export default AllRoutes;