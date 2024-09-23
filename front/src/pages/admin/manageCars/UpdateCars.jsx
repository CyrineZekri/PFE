import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TextInput, Button, Label, Spinner, Card } from 'flowbite-react';
import { toast } from 'react-toastify'; 
import useCarService from "../../../services/carService";

export default function UpdateCars() {
  const baseURL = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCarById, updateCar, uploadImages } = useCarService();

  const [carData, setCarData] = useState({
    marque: '',
    modele: '',
    description: '',
    prixLocation: '',
    images: [],
  });

  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = async () => {
    try {
      const car = await getCarById(id);
      if (car) {
        setCarData(car);
      } else {
        toast.error('Impossible de charger les données de la voiture');
        navigate('/admin/cars');
      }
    } catch (error) {
      toast.error('Impossible de charger les données de la voiture');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...Array.from(e.target.files)]);
  };

  const handleRemoveImage = (index) => {
    setCarData({
      ...carData,
      images: carData.images.filter((_, imgIndex) => imgIndex !== index),
    });
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImagePaths = [];

      if (newImages.length > 0) {
        const formData = new FormData();
        newImages.forEach((file) => {
          formData.append("images", file);
        }); 
        uploadedImagePaths = await uploadImages(formData);

       
      }

      const updatedCar = {
        ...carData,
        images: [...carData.images, ...uploadedImagePaths],
      };

      await updateCar(id, updatedCar);
      toast.success("Car updated successfully!");
      navigate("/admin/dashboard/manage-cars/all");
    } catch (error) {
      toast.error(`Erreur lors de la mise à jour de la voiture : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner aria-label="Loading car data" />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <Card className="">
        <h2 className="text-2xl font-bold mb-6 text-center">Mise à jour de la voiture</h2>
        <form onSubmit={handleSubmit} enctype="multipart/form-data" className="space-y-6">
          <div>
            <Label htmlFor="marque" value="Marque" />
            <TextInput
              id="marque"
              name="marque"
              value={carData.marque}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="modele" value="Modèle" />
            <TextInput
              id="modele"
              name="modele"
              value={carData.modele}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description" value="Description" />
            <TextInput
              id="description"
              name="description"
              value={carData.description}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="prixLocation" value="Prix de Location" />
            <TextInput
              id="prixLocation"
              name="prixLocation"
              type="number"
              value={carData.prixLocation}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="images" value="Images" className="mb-4" />
            <div className="grid grid-cols-4 gap-4 mt-4">
              {carData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={baseURL + `/${img}`}
                    alt={`car-${index}`}
                    className="w-72 h-40 object-cover rounded"
                  />
                  <Button
                    size="xs"
                    color="failure"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                id="newImages"
                type="file"
                multiple
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                "
              />
              <div className="grid grid-cols-2 gap-4 mt-2">
                {newImages.map((image, index) => (
                  <div key={index} className="relative group w-24">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="new"
                      className="w-48 h-48 object-cover rounded"
                    />
                    <Button
                      size="xs"
                      color="failure"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="p-2 border rounded w-full bg-blue-600 text-white" disabled={loading}>
              {loading ? <Spinner aria-label="Loading..." /> : "Mise à jour de la voiture"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
