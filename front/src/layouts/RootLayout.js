import React from "react"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom"; 
import Footer from "../components/Footer"; 
import Header from "../components/Header";
 export default function RootLayout() {
  return (
    <div>
      <ToastContainer />
      <Header />
      <main className="bg-gray-200/60" >
         
        <Outlet />
       
      </main> 
      <Footer />
    </div>
  );
}
