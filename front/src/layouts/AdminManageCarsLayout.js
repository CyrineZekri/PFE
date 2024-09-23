import React from 'react'
import { Outlet } from "react-router-dom";
export default function AdminManageCarsLayout() {
  return (
    <div className='w-full'>
    <Outlet  />

</div>
  )
}
