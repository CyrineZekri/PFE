import React, { useState, useEffect } from "react";
import useCarService from "../services/carService";
import CarCard from "../components/CarCard";
import {TextInput } from "flowbite-react";
import { FaFilter } from "react-icons/fa";

export default function AllCars() {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilter, setShowFilter] = useState(false); // State for showing/hiding filter section
  const { getAllCars } = useCarService();

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await getAllCars();
        setCars(response);
        setFilteredCars(response); //Initially, all cars are assigned to filtered
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    }
    fetchCars();// eslint-disable-next-line 
  }, []);//emty array to run only once

  // Auto-apply filters when any input changes
  useEffect(() => {
    let filtered = cars;

    if (marque) {
      filtered = filtered.filter(car =>
        car.marque.toLowerCase().includes(marque.toLowerCase())
      );
    }

    if (modele) {
      filtered = filtered.filter(car =>
        car.modele.toLowerCase().includes(modele.toLowerCase())
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(car => car.prixLocation <= parseFloat(maxPrice));
    }

    setFilteredCars(filtered);
  }, [marque, modele, maxPrice, cars]);

  const handleReset = () => {
    setMarque("");
    setModele("");
    setMaxPrice("");
    setFilteredCars(cars);
  };

  return (
    <div className="flex">
      {/* Button to show/hide filters */}
      <button
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 ${showFilter ? "bg-green-600" : "bg-red-500"}  text-white p-2 rounded-r-lg z-50 md:hidden`}
        onClick={() => setShowFilter(!showFilter)}
      >
        <FaFilter />
      </button>

      {/* Sidebar for Filters */}
      <div
        className={`fixed top-0 left-0 w-full md:w-1/5 p-4 min-h-screen bg-blue-600 text-white transition-transform transform ${
          showFilter ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40 md:static md:block`}
      >
        <h3 className="text-xl font-semibold mb-4 text-white">Filtres</h3>
        <div className="mb-4">
          <TextInput
            type="text"
            placeholder="Filtrer par marque"
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="text"
            placeholder="Filtrer par modèle"
            value={modele}
            onChange={(e) => setModele(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <TextInput
            type="number"
            placeholder="Prix max (DT)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          {/* Show reset button only when filters are applied */}
          {marque || modele || maxPrice ? (
            <button onClick={handleReset} className="w-full bg-white border rounded-lg text-black p-2 font-bold transition-all hover:bg-black hover:text-white">
              Réinitialiser
            </button>
          ) : null}
        </div>
      </div>

      {/* Cars Display Section */}
      <div className="w-full md:w-3/4 p-4">
        <h2 className="text-3xl font-bold text-center mb-8">Toutes les voitures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
}
