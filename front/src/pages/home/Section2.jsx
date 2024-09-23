import React, { useState, useEffect } from 'react'; 
import CarCard from '../../components/CarCard';
import { Button } from 'flowbite-react';
import axios from 'axios';
import useCarService from '../../services/carService';
import { Link } from 'react-router-dom';

export default function Section2() {
  const [cars, setCars] = useState([]);
  const { getAllCars} = useCarService();
  async function fetchCars() {
    try {
      const data = await getAllCars();
      setCars(data);
      // Shuffle the cars array and select random 4 cars
      const shuffledCars = data.data.sort(() => 0.5 - Math.random());
      setCars(shuffledCars.slice(0, 4));
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  }
  useEffect(() => {

    fetchCars();
  }, []);

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Nos voitures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cars.map(car => (
            <CarCard key={car._id} car={car} />
          ))}
         
        </div>
        <div className="flex justify-center mt-12">
          <Link to="/all-cars" color="light" className='p-2 transition-all bg-blue-500 text-white rounded-md hover:bg-blue-600'>
            Voir toutes les voitures
          </Link>
        </div>
      </div>
    </div>
  );
}
