import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../../services/authService"; 
import { Spinner } from "flowbite-react";
import rentcarLogo from "../../assets/rentCarLogo.png";

export default function Register() {
  //init form state
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    motDePasse: "",
    confirmMotDePasse: "",
    telephone: "",
    adresse: "",
  });

  const [showMotDePasse, setShowMotDePasse] = useState(false);
  const [showConfirmMotDePasse, setShowConfirmMotDePasse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // errors related to typing, initialized to no errors 
//update form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error message for the current field
  };
// validate email andpasswords
  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }
    if (formData.motDePasse !== formData.confirmMotDePasse) {
      newErrors.motDePasse = "Les mots de passe ne correspondent pas.";
      newErrors.confirmMotDePasse = "Les mots de passe ne correspondent pas.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        // eslint-disable-next-line
        const data = await register({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          motDePasse: formData.motDePasse,
          telephone: formData.telephone,
          adresse: formData.adresse,
        });

        toast.success("Inscription réussie", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setFormData({
          nom: "",
          prenom: "",
          email: "",
          motDePasse: "",
          confirmMotDePasse: "",
          telephone: "",
          adresse: "",
        });
        setLoading(false);
      } catch (error) {
        setErrors({ ...errors, apiError: error.message });
        toast.error(error.message, {
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
      }
    }
  };

  return (
    <div className="bg-white">
      <div className="md:grid md:grid-cols-2">
       <div className="flex justify-center items-center">
       <img className="hidden md:block" src={rentcarLogo} alt="" />
       </div>
        <div className="flex justify-center items-center">
          <div className="p-12">
            <h2 className="text-3xl font-black py-2">Créer un compte</h2>
            <h3 className="py-4 text-xl">Entrez vos coordonnées ci-dessous</h3>
            <form className="my-8" onSubmit={handleSubmit}>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="nom"
                  id="nom"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formData.nom}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <label
                  htmlFor="nom"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Nom
                </label>
                {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="prenom"
                  id="prenom"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formData.prenom}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <label
                  htmlFor="prenom"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Prénom
                </label>
                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <label
                  htmlFor="email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Adresse email
                </label>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type={showMotDePasse ? "text" : "password"}
                  name="motDePasse"
                  id="motDePasse"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formData.motDePasse}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <label
                  htmlFor="motDePasse"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Mot de passe
                </label>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowMotDePasse(!showMotDePasse)}>
                  {showMotDePasse ? <FaEyeSlash /> : <FaEye />}
                </div>
                {errors.motDePasse && <p className="text-red-500 text-sm mt-1">{errors.motDePasse}</p>}
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type={showConfirmMotDePasse ? "text" : "password"}
                  name="confirmMotDePasse"
                  id="confirmMotDePasse"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formData.confirmMotDePasse}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <label
                  htmlFor="confirmMotDePasse"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75
                  top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Confirmer le mot de passe
                </label>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setShowConfirmMotDePasse(!showConfirmMotDePasse)}>
                  {showConfirmMotDePasse ? <FaEyeSlash /> : <FaEye />}
                </div>
                {errors.confirmMotDePasse && <p className="text-red-500 text-sm mt-1">{errors.confirmMotDePasse}</p>}
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="telephone"
                  id="telephone"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formData.telephone}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <label
                  htmlFor="telephone"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Numéro de téléphone
                </label>
                {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
              </div>

              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="adresse"
                  id="adresse"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={formData.adresse}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <label
                  htmlFor="adresse"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Adresse
                </label>
                {errors.adresse && <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>}
              </div>

              {errors.apiError && <p className="text-red-500 text-sm mb-5">{errors.apiError}</p>}

              <button
                type="submit"
                className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <Spinner aria-label="Loading" />
                ) : (
                  "S'inscrire"
                )}
              </button>

              <p className="text-sm text-center text-gray-500 mt-4">
                Vous avez déjà un compte?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
