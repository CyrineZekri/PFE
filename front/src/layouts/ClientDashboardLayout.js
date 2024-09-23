import React from 'react'
import { Outlet } from "react-router-dom";
import ClientSideBar from '../pages/client/ClientSideBar';
export default function ClientDashboardLayout() {
  return (
    <div className='flex'>
    <ClientSideBar />
    <Outlet  />
  </div>
  )
}
