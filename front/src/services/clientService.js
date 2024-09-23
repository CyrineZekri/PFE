import axios from "axios";
import { useSelector } from 'react-redux';

const baseURL = process.env.REACT_APP_API_URL + "/api";

const useClientService = () => {

  const token = useSelector((state) => state.auth.token);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

    // Add a new reservation
    const addReservation = async (reservationData) => {
        try {
            const { data } = await axios.post(`${baseURL}/reservations`, reservationData, authHeaders);
            return data.reservation;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    //get client reservations
    const getClientReservations = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/client/reservations`, authHeaders);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    //get client profile
    const getClientProfile = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/client/profile`, authHeaders);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    //update client profile 
    const updateClientProfile = async (clientData) => {
        try {
            const { data } = await axios.put(`${baseURL}/client/profile`, clientData, authHeaders);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    

    return { addReservation , getClientReservations, getClientProfile, updateClientProfile };
}

export default useClientService;