import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useCarService from "../../../services/carService";
import { Spinner } from "flowbite-react";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importing calendar styles
import { CiCircleRemove } from "react-icons/ci";
export default function CarAvailability() {
  const baseURL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCarById, setCarAvailability, deleteCarIndisponibility } =
    useCarService();
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [car, setCar] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [loadingRemoveAvailabilities, setLoadingRemoveAvailabilities] =
    useState({
      loading: false,
      id: null,
    });
  async function fetchCar() {
    try {
      const carData = await getCarById(id);
      if (carData) {
        setCar(carData);
      } else {
        toast.error("Voiture non trouvée.");
      }
    } catch (error) {
      console.error(
        "Impossible de récupérer les détails de la voiture :",
        error
      );
      toast.error(
        "Une erreur s'est produite lors de la récupération des détails de la voiture."
      );
    }
  }

  useEffect(() => {
    fetchCar();
  }, [id, navigate]);

  const handleDateChange = (range) => {
    setDateRange(range);
  };
  const DeleteUnavailabilitieDate = async (dispoId, carId) => {
    /* console.log(dispoId, carId); */
    try {
      setLoadingRemoveAvailabilities({ loading: true, id: dispoId });
      const updatedCar = await deleteCarIndisponibility(carId, dispoId);
      if (updatedCar) {
        setCar(updatedCar);
        setLoadingRemoveAvailabilities({ loading: false, id: null });
        toast.success("Indisponibilité supprimée avec succès.");
      } else {
        toast.error("Échec de la suppression de l'indisponibilité.");
        setLoadingRemoveAvailabilities({ loading: false, id: null });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'indisponibilité :",
        error
      );
      setLoadingRemoveAvailabilities({ loading: false, id: null });
      toast.error(
        "Une erreur s'est produite lors de la suppression de l'indisponibilité."
      );
    }
  };
  const handleAvailabilityUpdate = async () => {
    try {
      const [dateDebut, dateFin] = dateRange;
      setLoadingAvailability(true);
      const updatedCar = await setCarAvailability(id, { dateDebut, dateFin });
      if (updatedCar) {
        setCar(updatedCar);
        setLoadingAvailability(false);
        toast.success(
          "La disponibilité des voitures a été mise à jour avec succès."
        );
      } else {
        toast.error(
          "Échec de la mise à jour de la disponibilité de la voiture."
        );
        setLoadingAvailability(false);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la disponibilité :",
        error
      );
      toast.error(
        "Une erreur s'est produite lors de la mise à jour de la disponibilité."
      );
      setLoadingAvailability(false);
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
    <div className="grid grid-cols-2 gap-8 p-8">
      {/* Car Details Section */}
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">
          {car.marque} / {car.modele}
        </h2>
        <img
          src={baseURL + `/${car.images[0]}`}
          alt={`${car.marque} ${car.modele}`}
          className="rounded-lg shadow mb-4 w-full"
        />
        <p className="text-xl">
          <strong>Prix par jour:</strong> {car.prixLocation} Dt / jour
        </p>
        <p className="text-sm text-gray-600 mt-2">{car.description}</p>

        {car.indisponibilites.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">indisponible le :</h3>
            <ul className="space-y-2">
              {car.indisponibilites.map((dispo) => {
                const dateDebut = new Date(dispo.dateDebut);
                const dateFin = new Date(dispo.dateFin);
                const numberOfDays =
                  Math.ceil((dateFin - dateDebut) / (1000 * 60 * 60 * 24)) + 1;
                return (
                  <li
                    key={dispo._id}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-lg"
                  >
                    <span>
                      {dateDebut.toLocaleDateString()} -{" "}
                      {dateFin.toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {numberOfDays} jours
                    </span>
                    <div>
                      <button
                        className="bg-red-700 p-4 border rounded-md text-white hover:bg-red-900"
                        onClick={() => {
                          DeleteUnavailabilitieDate(dispo._id, car._id);
                        }}
                      >
                        {loadingRemoveAvailabilities.id === dispo._id &&
                        loadingRemoveAvailabilities.loading ? (
                          <Spinner className="w-6 h-6 ml-2" />
                        ) : (
                          <CiCircleRemove />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Calendar and Availability Management Section */}
      <div className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center">
        <h2 className="text-3xl font-semibold mb-4">
          Gestion des disponibilités
        </h2>
        <Calendar
          selectRange={true}
          onChange={handleDateChange}
          value={dateRange}
          tileDisabled={({ date }) =>
            car.indisponibilites.some(
              (dispo) =>
                date >= new Date(dispo.dateDebut) &&
                date <= new Date(dispo.dateFin)
            )
          }
          className="mb-4"
        />
        <button
          onClick={handleAvailabilityUpdate}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {loadingAvailability ? (
            <div className="flex gap-2">
              chargement ... <Spinner className="w-6 h-6 ml-2" />
            </div>
          ) : (
            "Mettre à jour la disponibilité "
          )}
        </button>
      </div>
    </div>
  );
}
