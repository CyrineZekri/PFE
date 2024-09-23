import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie, 
} from "react-icons/hi";
import { MdOutlinePreview } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom"; 
import { useDispatch } from "react-redux";
import { performLogout } from "../../redux/actions/authActions"; 
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md"; 
import { FaCarSide } from "react-icons/fa";
export default function AdminSideBar() {
  const [HideSidebar, setHideSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(performLogout());
    navigate("/login");
  };
  return (
    <div>
      <Sidebar
        aria-label="Default sidebar example"
        className={`h-screen transition-all duration-300 ${
          HideSidebar ? "w-16" : "w-64"
        }
        `}
      >
        <div className="flex items-center justify-end p-2">
          <button
            onClick={() => {
              setHideSidebar(!HideSidebar);
            }}
          >
            <HiArrowSmRight
              className={`transform transition-transform duration-300 ${
                HideSidebar ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
        <Sidebar.Items className="flex flex-col min-h-screen">
          <Sidebar.ItemGroup>
         
            <NavLink to="/admin/dashboard">
              <Sidebar.Item className="cursor-pointer hover:bg-blue-500 hover:text-white">
                <div className="flex gap-2 items-center hover:text-white">
                  <span className="text-2xl">
                    {" "}
                    <HiChartPie />{" "}
                  </span>{" "}
                  {!HideSidebar && <span>Dashboard</span>}
                </div>
              </Sidebar.Item>
            </NavLink>
            <NavLink to="/admin/dashboard/profile">
              <Sidebar.Item
                className="cursor-pointer hover:bg-blue-500 hover:text-white"
                labelColor="dark"
                label={HideSidebar ? null : "Admin"}
              >
                <div className="flex gap-2 items-center hover:text-white">
                  <span className="text-2xl">
                    {" "}
                    <CgProfile />{" "}
                  </span>{" "}
                  {!HideSidebar && <span>Profile</span>}
                </div>
              </Sidebar.Item>
            </NavLink>

            <NavLink to="/admin/dashboard/manage-cars/all">
              <Sidebar.Item className="cursor-pointer hover:bg-blue-500 hover:text-white">
                <div className="flex gap-2 items-center hover:text-white">
                  <span className="text-2xl">
                    {" "}
                    <FaCarSide />{" "}
                  </span>
                  {!HideSidebar && <span>gestion des voiture</span>}
                </div>
              </Sidebar.Item>{" "}
            </NavLink>

            <NavLink to="/admin/dashboard/manage-demandes/all">
              <Sidebar.Item className="cursor-pointer hover:bg-blue-500 hover:text-white">
                <div className="flex gap-2 items-center hover:text-white">
                  <span className="text-2xl">
                    {" "}
                    <MdOutlinePreview />{" "}
                  </span>
                  {!HideSidebar && <span>gestion des demande</span>}
                </div>
              </Sidebar.Item>{" "}
            </NavLink>
            <Sidebar.Item
              k
              className="cursor-pointer hover:bg-red-500 hover:text-white"
            >
              <div
                className="flex gap-2 items-center hover:text-white"
                onClick={handleLogout}
              >
                <span className="text-2xl">
                  {" "}
                  <MdLogout />{" "}
                </span>{" "}
                {!HideSidebar && <span>Se déconnecter
                  </span>}
              </div>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  );
}
