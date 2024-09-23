import axios from "axios";
import { useSelector } from 'react-redux';
 
const baseURL = process.env.REACT_APP_API_URL + "/api";
const useAdminService = () => {
    
  const token = useSelector((state) => state.auth.token);
    
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
     
        // Get admin profile
        const getAdminProfile = async () => {
          try {
             const { data } = await axios.get(`${baseURL}/admin/profile`, authHeaders);
             console.log(data);
             return data;
          } catch (error) {
             console.error(error);
             return null; // Return null if the admin is not found
          }
        };
     
        // Update admin profile
        const updateAdminProfile = async (updates) => {
          try {
             const { data } = await axios.put(`${baseURL}/admin/profile`, updates, authHeaders);
             return data;
          } catch (error) {
             console.error(error);
             return null; // Return null if there was an error updating the admin
          }
        };

        //get all reservations
        const getAllReservations = async () => {
          try {
             const { data } = await axios.get(`${baseURL}/reservations`, authHeaders);
             return data;
          } catch (error) {
             console.error(error);
             return null; // Return null if the admin is not found
          }
        };

        //get reservation by id
        const getReservationById = async (reservationId) => {
          try {
             const { data } = await axios.get(`${baseURL}/reservations/${reservationId}`, authHeaders);
             return data;
          } catch (error) {
             console.error(error);
             return null; // Return null if the admin is not found
          }
        };

       // accept reservation
const acceptReservation = async (reservationId) => {
   try {
     const { data } = await axios.put(
       `${baseURL}/reservations/accept/${reservationId}`, 
       {}, // Make sure to pass an empty object if there is no body in the PUT request
       authHeaders // Pass the headers as the third argument
     );
     console.log(data);
     return data;
   } catch (error) {
     console.error(error);
     return null; // Return null if the request fails
   }
 };
 
 // refuse reservation
 const refuseReservation = async (reservationId) => {
   try {
     const { data } = await axios.put(
       `${baseURL}/reservations/refuse/${reservationId}`, 
       {}, // Make sure to pass an empty object if there is no body in the PUT request
       authHeaders // Pass the headers as the third argument
     );
     return data;
   } catch (error) {
     console.error(error);
     return null; // Return null if the request fails
   }
 };

 //get statistics
  const getStatistics = async () => {
    try {
        const { data } = await axios.get(`${baseURL}/admin/statistics`, authHeaders);
        return data;
    }
    catch (error) {

        console.error(error);
        return null; // Return null if the request fails

    }}
 
     
        return {
          getAdminProfile,
          updateAdminProfile,
          getAllReservations,
          getReservationById,
          acceptReservation,
          refuseReservation,
          getStatistics
          
        };

}
export default useAdminService;