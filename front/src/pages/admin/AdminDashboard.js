import React, { useState, useEffect } from 'react'; 
import { FaCarSide } from "react-icons/fa";
import useAdminService from '../../services/adminServices';
import { toast } from 'react-toastify';
import { FaUsers } from "react-icons/fa6";
import { Card,Spinner } from 'flowbite-react';
import {   HiOutlineShoppingCart  } from 'react-icons/hi'; 
export default function AdminDashboard() {

  const { getStatistics } = useAdminService();
const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const stats = await getStatistics();

      setStatistics(stats);
      setLoading(false);
      console.log(stats);
    } catch (error) {
      toast.error(`Erreur lors de la récupération des statistiques
: ${error}`);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen p-4 w-full">
        <Spinner size="xl" />
      </div>
    );
  }
  return (
    <div>
       <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord d'administration
      </h1>
      <div className='flex justify-center items-center'>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center">
            <HiOutlineShoppingCart className="text-4xl text-blue-500" />
            <div className="ml-4">
              <p className="text-lg font-semibold">totalité des voitures</p>
              <p className="text-2xl p-1 font-bold text-white rounded-xl bg-blue-500 border-2 text-center">{statistics && statistics.totalCars}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            <FaCarSide className="text-4xl text-red-500" />
            <div className="ml-4">
              <p className="text-lg font-semibold"> voitures libres aujourd'hui</p>
              <p className="text-2xl p-1 font-bold text-white rounded-xl bg-red-500 border-2 text-center">{statistics && statistics.availableCarsToday}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
          <FaUsers className="text-4xl text-teal-500" />
            <div className="ml-4">
              <p className="text-lg font-semibold"> totalité des client</p>
              <p className="text-2xl p-1 font-bold text-white rounded-xl bg-teal-500 border-2 text-center">{statistics && statistics.totalClients}</p>
            </div>
          </div>
        </Card>
      </div>
      </div>
      
    </div>
    </div>
  )
}
