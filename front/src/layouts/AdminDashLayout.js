import React from 'react'
import { Outlet } from "react-router-dom";
import AdminSideBar from '../pages/admin/AdminSideBar';
export default function AdminDashLayout() {
  return (
    <div className='flex'>
      <AdminSideBar />
      <Outlet  />
    </div>
  )
}
