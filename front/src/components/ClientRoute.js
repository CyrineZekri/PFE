import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function ClientRoute({ element }) {

    const user = useSelector((state) => state.auth.user);
    return user && user.role === "Client" ? element : <Navigate to="/login" />;// protected client route 

}
