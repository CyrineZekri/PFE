import React from 'react';
import { Link } from 'react-router-dom';

export default function CarCard({ car }) {
  const baseURL = process.env.REACT_APP_API_URL;
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
      <diV>
        
      </diV>
      <img src={baseURL +"/" + car.images[0]} alt={`${car.marque} ${car.modele}`} className="w-full h-48 object-cover transition-all hover:h-56" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{car.marque}</h3>
        <p className="text-gray-500">{car.modele}</p>
        <div className="mt-4">
          <span className="text-lg font-bold text-gray-800">{car.prixLocation} DT / jour</span>
        </div> 
        <Link to={`/car/${car._id}`} className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-center p-2 rounded-lg mt-4">
          Voir plus
        </Link>
      </div>
    </div>
  );
}
