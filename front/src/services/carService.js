import axios from "axios";
import { useSelector } from 'react-redux';
import { toast } from "react-toastify";

const baseURL = process.env.REACT_APP_API_URL + "/api";

const useCarService = () => {

  const token = useSelector((state) => state.auth.token);

  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // Get all cars
  const getAllCars = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/cars`, authHeaders);
      return data.cars; // Accessing the cars array directly
    } catch (error) {
      console.error(error);
      return []; // Return an empty array on error
    }
  };

  // Get a car by ID
  const getCarById = async (id) => {
    try {
      const { data } = await axios.get(`${baseURL}/cars/${id}`, authHeaders);
      return data.car;
    } catch (error) {
      console.error(error);
      return null; // Return null if the car is not found
    }
  };

  // Add a new car
  const addCar = async (carData) => {
    try {
      const { data } = await axios.post(`${baseURL}/cars`, carData, authHeaders);
      return data.car;
    } catch (error) {
      console.error(error);
      return null; // Return null if there was an error adding the car
    }
  };

  // Update car details
  const updateCar = async (id, updates) => {
    try {
      console.log("updates", updates);
      const { data } = await axios.put(`${baseURL}/cars/${id}`, updates, authHeaders);
      return data.car;
    } catch (error) {
      console.error(error);
      return null; // Return null if there was an error updating the car
    }
  };

  // Delete a car
  const deleteCar = async (id) => {
    try {
      const { data } = await axios.delete(`${baseURL}/cars/${id}`, authHeaders);
      return data.message; // Return success message
    } catch (error) {
      console.error(error);
      return null; // Return null if there was an error deleting the car
    }
  };

  // Set car availability
  const setCarAvailability = async (id, availability) => {
    try {
      const { data } = await axios.put(`${baseURL}/cars/availability/${id}`, availability, authHeaders);
      console.log("data", data);
      return data.car;
    } catch (error) {
      console.error(error);
      return null; // Return null if there was an error setting availability
    }
  };
 // Upload image
 const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const { data } = await axios.post(`${baseURL}/upload`, formData, {
      ...authHeaders,
      headers: {
        ...authHeaders.headers,
        "Content-Type": "multipart/form-data"
      }
    });
    return data.filePath; // Use filePath as returned from the server
  } catch (error) {
    console.error("Failed to upload image", error);
    return null; // Return null if there was an error uploading the image
  }
};

//upload images 
const uploadImages = async (formData) => { 

  try {
    const { data } = await axios.post(`${baseURL}/uploadMultiple`, formData, {
      ...authHeaders,
      headers: {
        ...authHeaders.headers,
        "Content-Type": "multipart/form-data"
      }
    });
    return data.filePaths; // Use filePaths as returned from the server
  }
  catch (error) {
    console.error("Failed to upload images", error);
    return null; // Return null if there was an error uploading the images
  }
}

// Delete a specific unavailability
const deleteCarIndisponibility = async (id, indisponibilityId) => {
  try {
    const { data } = await axios.delete(`${baseURL}/cars/availability/${id}/${indisponibilityId}`, authHeaders);
    return data.car;
  } catch (error) {
    console.error(error);
    toast.error("Une erreur s'est produite lors de la suppression de l'indisponibilité.");  
    return null; // Return null if there was an error deleting the unavailability
  }
}

  





  return { getAllCars,uploadImage , getCarById, addCar, updateCar, deleteCar, setCarAvailability ,uploadImages, deleteCarIndisponibility};
};

export default useCarService;
