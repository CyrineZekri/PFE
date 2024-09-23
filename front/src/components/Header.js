import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { MdLogin } from "react-icons/md";  
import { MdLogout } from "react-icons/md";
import ProfilePic from "../assets/userIcon.png"
import rentCarLogo from "../assets/Logo2Rent.jpg";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineAppRegistration } from "react-icons/md";
import { performLogout } from "../redux/actions/authActions";

export default function Header() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // extract the user object from the auth state.
  /*  console.log(user); */
  const dispatch = useDispatch();
  const navLinkClassNames = ({ isActive }) =>
    `text-base font-bold p-2 my-1 rounded ${
      isActive
        ? "text-white bg-blue-500 md:text-blue-500 md:bg-white"
        : "hover:bg-blue-500 hover:md:text-white  "
    }`;
  const handleLogout = () => {
    dispatch(performLogout());
    navigate("/login");
  };
  return (
    <Navbar fluid rounded className="shadow-xl border-b-2 border-gray-400">
      <Navbar.Brand href="/">
        <img src={rentCarLogo} alt="smr-store logo" className="h-14" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          maxula rent cars
        </span>
      </Navbar.Brand>
      <div className="flex md:order-2">
  {/*  user is logged in */}        
  {user && (
          <Dropdown
            arrowIcon={false}
            inline
            className="mx-2"
            label={
              <Avatar
                alt="User settings"
                img={ProfilePic}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.other.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.other.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item
              onClick={() =>
                navigate(user.role === "Admin" ? "/admin/dashboard" : "/client/dashboard")
              }
            >
              Tableau de bord

            </Dropdown.Item>

            <Dropdown.Divider />
            <Dropdown.Item
              className="hover:bg-red-700 hover:text-white"
              onClick={handleLogout}
            >
              <MdLogout />
              se déconnecter

            </Dropdown.Item>
          </Dropdown>
        )}
          {/* no user*/}
        {!user && (
          <div className="flex mx-2 items-center gap-2">
            <NavLink to="/register">
              <div className="border-2 border-gray-300 p-2 rounded font-bold text-2xl rounded-full hover:bg-blue-500 hover:text-white">
                <MdOutlineAppRegistration />
              </div>
            </NavLink>

            <NavLink to="/login">
              <div className="border-2 p-2 border-gray-300 rounded font-bold text-2xl rounded-full hover:bg-blue-600 hover:text-white">
                <MdLogin />
              </div>
            </NavLink>
          </div>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <NavLink to="/" className={navLinkClassNames}>
          accueil
        </NavLink>
        <NavLink to="/all-cars" className={navLinkClassNames}>
          voitures
        </NavLink>

      </Navbar.Collapse>
    </Navbar>
  );
}
