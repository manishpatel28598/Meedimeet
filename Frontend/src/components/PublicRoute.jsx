import React from 'react'
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
    console.log("children from public routes: ", children)
    if(localStorage.getItem('token')){
        return <Navigate to="/" />
    }else{
        return children;
    }
}

export default PublicRoute;
