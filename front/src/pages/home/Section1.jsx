import React from "react";
import CarModel from "../../assets/carModel.png";

export default function Section1() {
  return (
    <div className="bg-white p-8">
      <div className="grid grid-cols-2 gap-8 items-center">
        <div className="text-start">
          <h2 className="text-4xl font-black mb-4">
            Réservez Une Voiture Près De Chez Vous Et Conduisez En quelques
            minutes !
          </h2>
          <p className="text-lg mb-4">
            Réservez une voiture près de chez vous et conduisez en quelques
            minutes !
          </p> 
        </div>
      <div className="relative">
  <div className="absolute inset-y-0 left-0 bg-red-500 w-[40%] rounded-lg"></div>
    {/* The car is here */}
    <img
    src={CarModel}
    alt="car model"
    className="relative w-[500px] ml-8 animate-float" // my created animation 
  />
</div>

      </div>
    </div>
  );
}
