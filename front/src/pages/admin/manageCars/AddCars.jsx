import React, { useState } from 'react';
import { Button, TextInput, Textarea, FileInput , Spinner} from 'flowbite-react';

import useCarService from "../../../services/carService";
import { toast } from 'react-toastify';
export default function AddCars() {
  const { addCar } = useCarService();
 const [loading, setLoading] = useState(false);
  const [carDetails, setCarDetails] = useState({
    marque: '',
    modele: '',
    description: '',
    prixLocation: '',
    indisponibilites: [],
  });
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setCarDetails({
      ...carDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('marque', carDetails.marque);
    formData.append('modele', carDetails.modele);
    formData.append('description', carDetails.description);
    formData.append('prixLocation', carDetails.prixLocation);

    console.log(carDetails);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const response = await addCar(formData);
      console.log(response);
      if (response) {
        /* alert('Car added successfully'); */
        toast.success('Voiture ajoutée avec succès');
        setLoading(false);
        // Clear form fields
        setCarDetails({
          marque: '',
          modele: '',
          description: '',
          prixLocation: '',
          indisponibilites: [],
        });
        // Clear file input
        setImages(null);
      } else {
        alert("Erreur lors de l'ajout de la voiture :");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la voiture :" , error);
      setLoading(false);
      alert("Erreur lors de l'ajout de la voiture :" );
    }
  };

  return (
    <div className="m-2 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ajouter une nouvelle voiture
      </h2>
      <form onSubmit={handleSubmit}>
        <label className="text-gray-700">Marque :</label>
        <div className="mb-4">
          <TextInput
            label="Marque"
            name="marque"
            value={carDetails.marque}
            onChange={handleChange}
            required
          />
        </div>
        <label className="text-gray-700">Modèle :</label>
        <div className="mb-4">
          <TextInput
            label="Modèle"
            name="modele"
            value={carDetails.modele}
            onChange={handleChange}
            required
          />
        </div>
        <label className="text-gray-700">Description :</label>
        <div className="mb-4">
          <Textarea
            label="Description"
            name="description"
            value={carDetails.description}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        <label className="text-gray-700">Prix de Location :</label>
        <div className="mb-4">
          <TextInput
            label="Prix de Location"
            name="prixLocation"
            type="number"
            value={carDetails.prixLocation}
            onChange={handleChange}
            required
          />
        </div>
        <label className="text-gray-700">Images :</label>
        <div className="mb-4">
          <FileInput
            label="Images"
            name="images"
            multiple
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
         

          {
            loading ? (
              <Spinner size="sm" className="ml-2" />
            ) : (
              "Ajouter une voiture"
            )
             
          }
        </Button>
      </form>
    </div>
  );
}
