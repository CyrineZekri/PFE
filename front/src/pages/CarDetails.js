import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useCarService from "../services/carService";
import { Spinner } from 'flowbite-react';
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import useClientService from "../services/clientService"; 
import { useSelector } from 'react-redux';

export default function CarDetails() {
  const baseURL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCarById } = useCarService();
  const { addReservation } = useClientService(); // Use the addReservation function
  const user = useSelector((state) => state.auth.user);
  const [car, setCar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(''); // Track selected image
  const [selectedDates, setSelectedDates] = useState([]);
  const [loadingReservationRequest, setLoadingReservationRequest] = useState(false);
///////////   Calcul des jours ///////////
  const formatReservationDates = (dates) => {
    if (dates.length === 0) return null;
    const dateDebut = dates[0].toISOString();
    const dateFin = new Date(dates[dates.length - 1].getTime() + (24 * 60 * 60 * 1000) - 1).toISOString();
    return { carId: id, dateDebut, dateFin };
  };

///////////fetch the car selected //////////
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const carData = await getCarById(id);
        if (carData) {
          setCar(carData);
          setSelectedImage(carData.images[0]); // Set the first image as the default selected image
        } else {
          toast.error("Car not found.");
          navigate("/all-cars");
        }
      } catch (error) {
        toast.error("An error occurred while fetching car details.");
      }
    };
    fetchCar();
    // eslint-disable-next-line
  }, [id]);

/////////// date selection on calendar  //////////
const handleDateSelect = (date) => {
    setSelectedDates((prevDates) =>
      prevDates.includes(date)
        ? prevDates.filter((d) => d !== date)
        : [...prevDates, date]
    );
  };
/////////// Rental request //////////

  const handleRentalRequest = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour soumettre une demande de location.");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }
    if (selectedDates.length > 0) {
      const reservationData = formatReservationDates(selectedDates);
      if (reservationData) {
        setLoadingReservationRequest(true);
        const result = await addReservation(reservationData);
        if (result) {
          toast.success("Demande de location soumise avec succès.");
          setSelectedDates([]);
        } else {
          toast.error("Échec de la soumission de la demande de location.");
        }
        setLoadingReservationRequest(false);
      }
    } else {
      toast.error("Veuillez sélectionner une ou plusieurs dates.");
    }
  };

    if (!car) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="p-12 bg-white rounded-lg shadow">
      {/* Car Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-3xl font-semibold mb-4">{car.marque} / {car.modele}</h2>
          
          {/* Main Image */}
          <img
            src={baseURL + "/" + selectedImage}
            alt={`${car.marque} ${car.modele}`}
            className="rounded-lg shadow mb-4 w-[550px] h-[400px] object-cover"
          />

          {/* Gallery of small images */}
          <div className="flex space-x-2 mt-4">
            {car.images.map((image, index) => (
              // eslint-disable-next-line
              <img 
                key={index}
                src={baseURL + "/" + image}
                alt={`Car image ${index + 1}`}
                className={`w-20 h-20 object-cover rounded cursor-pointer ${
                  selectedImage === image ? "border-2 border-blue-500" : "border"
                }`}
                onClick={() => setSelectedImage(image)} // Change the main image on click
              />
            ))}
          </div>
    {/******************* car prix  *********************/}

          <p className="text-lg mt-4">
            <strong>Prix par jour:</strong>  {car.prixLocation} DT / jour
          </p>
          <p className="text-sm text-gray-600 mt-2">{car.description}</p>
    {/******************* car indisponibilité  *********************/}

          {car.indisponibilites.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Indisponibilités:</h3>
              <ul className="list-disc pl-6 space-y-2">
                {car.indisponibilites.map((dispo) => (
                  <li key={dispo._id}>
                    <span className="flex justify-between">
                      <span>
                        {new Date(dispo.dateDebut).toLocaleDateString()} -{" "}
                        {new Date(dispo.dateFin).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {/* Calcul jours  */}
                        ({Math.ceil(
                          (new Date(dispo.dateFin) - new Date(dispo.dateDebut)) /
                          (1000 * 60 * 60 * 24)
                        )}{" "}
                        jours)
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* *******Calendar and Rental Request Section */}
        <div className="flex justify-center">
          <div>
            <h3 className="text-xl font-semibold mb-4">Sélectionnez des dates pour louer</h3>
            <Calendar
              selectRange={true} //can select a range of dates on the calendar;multiple days 
              onClickDay={handleDateSelect}
              tileDisabled={({ date, view }) => {
                if (view === 'month') {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (date < today) return true;//diable prev dates 
                  return car.indisponibilites.some(
                    (dispo) =>
                      date >= new Date(dispo.dateDebut) &&
                      date <= new Date(dispo.dateFin)
                  );
                }
              }}
              tileContent={({ date, view }) => {
                if (view === 'month') {
                  const isUnavailable = car.indisponibilites.some(
                    (dispo) =>
                      date >= new Date(dispo.dateDebut) &&
                      date <= new Date(dispo.dateFin)
                  );
                  return isUnavailable ? (
                    <div className="h-2 w-2 rounded-full bg-red-500 mx-auto mt-1" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-green-500 mx-auto mt-1" />
                  );
                }
              }}
            />

            <button
              onClick={handleRentalRequest}
              className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {loadingReservationRequest ? <Spinner className="w-5 h-5 ml-2" /> : "Demande de location"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
