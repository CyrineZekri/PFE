import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { login } from "../../services/authService"; 
import { jwtDecode } from "jwt-decode";
import { useDispatch} from "react-redux";
import {
  loginStart,
  loginSuccess,
} from "../../redux/slices/authSlice";
import rentcarLogo from "../../assets/rentCarLogo.png";
import { Spinner } from "flowbite-react";
export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    motDePasse: "",
  });
  const redirectPath = localStorage.getItem("redirectAfterLogin"); //checks if there's a stored redirect path for after login
  console.log("in login detail ," + redirectPath);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});// initially no errors (empty object).
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch(); //send actions to the Redux store to update the global state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error message for the current field
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    dispatch(loginStart()); // CALL FOR REDUX
    try {
      /*   console.log(formData); */
      setLoading(true);
      const data = await login(formData);
      const decoded = jwtDecode(data.token);
      dispatch(loginSuccess({ user: decoded.user, token: data.token }));
      toast.success("Connexion réussie", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false); 
      if (decoded.user.role === "Admin") {
        navigate("/admin/dashboard"); // Redirect to admin dashboard 
        // to go to the car he was consulting 
        const redirectPath = localStorage.getItem("redirectAfterLogin");
        console.log("in login detail ," + redirectPath);
        if (redirectPath) {
          localStorage.removeItem("redirectAfterLogin"); // Remove it after using
          navigate(redirectPath); // Navigate to the stored location
        }
        if (redirectPath === null) {
          navigate("/client/dashboard"); // Redirect to client dashboard 
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        //show in toast
        toast.error("Email ou mot de passe incorrect");
        setErrors({ apiError: "Email ou mot de passe incorrect" });
      } else {
        //show in toast
        toast.error("Une erreur s'est produite lors de la connexion");
        setErrors({ apiError: "Une erreur s'est produite lors de la connexion" });
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div>
      <div className="bg-white">
        <div className="md:grid md:grid-cols-2">
          <div className="flex justify-center items-center">
            <img className="hidden md:block" src={rentcarLogo} alt="" />
          </div>
          <div className="flex justify-center items-center">
            <div className="p-12">
              <h2 className="text-3xl font-black py-2">
                connectez-vous pour louer des voitures
              </h2>
              <h3 className="py-4 text-xl">
                Entrez vos coordonnées ci-dessous
              </h3>
              <form className="my-8" onSubmit={handleSubmit}>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="email"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Adresse email
                  </label>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="motDePasse"
                    id="motDePasse"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="motDePasse"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Mot de passe
                  </label>
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="flex justify-end cursor-pointer my-2">
                  <Link
                    to={"/forget-password"}
                    className="text-[#DB4444] font-bold "
                  >
                  </Link>
                </div>
                <button className="bg-blue-500 w-full text-white rounded p-4 font-bold hover:bg-[#3FA2F6]">
                  se connecter
                </button>
                {errors.apiError && (
                  <p className="text-red-500 text-sm mt-1">{errors.apiError}</p>
                )}
                <div className="my-4 flex items-center gap-3 text-gray-600 font-bold">
                  <p>Vous n'avez pas de compte ?</p>
                  <Link className="hover:text-blue-600" to={"/register"}>
                    inscrivez-vous
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
