import React from 'react'
import { useAuthContext } from '../Context/AuthenticationContext'
import { Navigate } from 'react-router-dom';
const PrivateRoute = ({children}) => {
    const {user,isLoading}=useAuthContext();
    if(isLoading){
        return (
        <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
        Loading Home Page...
        </div>
    );
    }
    if(!user || !user._id){
        return <Navigate to={"/login"} replace/>
    }
    else return children;
}

export default PrivateRoute;
