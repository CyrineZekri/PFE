import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashLayout from "./layouts/AdminDashLayout";
import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminManageCars from "./pages/admin/manageCars/AdminManageCars";
import AdminManageDemandes from "./pages/admin/manageDemandes/AdminManageDemandes";
import AdminManageCarsLayout from "./layouts/AdminManageCarsLayout";
import AddCars from "./pages/admin/manageCars/AddCars";
import UpdateCars from "./pages/admin/manageCars/UpdateCars";
import AdminManageDemandesLayout from "./layouts/AdminManageDemandesLayout";
import CarAvailability from "./pages/admin/manageCars/CarAvailability";
import AllCars from "./pages/AllCars";
import CarDetails from "./pages/CarDetails";
import ClientDashboardLayout from "./layouts/ClientDashboardLayout";
import ClientProfile from "./pages/client/ClientProfile";
import MyReservations from "./pages/client/MyReservations";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/dashboard" element={<AdminDashLayout />}>
        <Route index element={<AdminRoute element={<AdminDashboard />} />} />
        <Route
          path="profile"
          element={<AdminRoute element={<AdminProfile />} />}
        />
        <Route
          path="manage-cars"
          element={<AdminRoute element={<AdminManageCarsLayout />} />}

         >
           <Route
            index
            path="all"
            element={<AdminRoute element={<AdminManageCars />} />}
          />
          <Route
            path="availability/:id"
            element={<AdminRoute element={<CarAvailability />} />}
          />
          <Route
            path="add"
            element={<AdminRoute element={<AddCars />} />}
            />
          <Route
            path="update/:id"
            element={<AdminRoute element={<UpdateCars />} />}
          />
          </Route>
        <Route
          path="manage-demandes"
          element={<AdminRoute element={<AdminManageDemandes />} />}
        >
           <Route
            index
            path="all"
            element={<AdminRoute element={<AdminManageCars />} />}
          />
          </Route>
      </Route>
      <Route path="/client/dashboard" element={<ClientDashboardLayout />}>
        <Route index element={<ClientRoute element={<ClientProfile />}/>} />
        <Route path="my-reservations" element={<ClientRoute element={<MyReservations/>}/>} />
      </Route>
      <Route path="all-cars" element={<AllCars />} />
      <Route path="car/:id" element={<CarDetails />} />

    </Route>
  )
);

export default router;
