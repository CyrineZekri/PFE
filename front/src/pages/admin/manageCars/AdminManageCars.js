import React, { useState, useEffect } from "react";
import { TextInput, Button, Table, Spinner, Alert } from "flowbite-react";
import { toast } from "react-toastify";
import useCarService from "../../../services/carService";
import { Link } from "react-router-dom";
export default function AdminManageCars() {
  const { getAllCars ,deleteCar} = useCarService();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const baseURL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchCars();
  }, []); 

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await getAllCars();
      setCars(data);
      console.log(data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des voitures");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = (id) => {
    
    //confirm then delete 
    if (window.confirm("Voulez-vous vraiment supprimer cette voiture?")) {
      deleteCar(id)
        .then(() => {
          toast.success("Voiture supprimée avec succès");
          fetchCars();
        })
        .catch(() => {
          toast.error("Erreur lors de la suppression de la voiture");
        });
    }
  };

   

  const filteredCars = cars.filter(
    (car) =>
      car.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.modele.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-4">Gestion des Voitures</h1>
     
      <Link to="/admin/dashboard/manage-cars/add" className="text-blue-500">
        <Button bg-blue-500 className="mb-4">
          Ajouter une voiture
        </Button>
      </Link>
      <div className="mb-4">
        <TextInput
          placeholder="Rechercher par marque ou modèle"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredCars.length > 0 ? (
        <Table hoverable className="min-w-full bg-white">
          <Table.Head>
            <Table.HeadCell>image</Table.HeadCell>
            <Table.HeadCell>Marque</Table.HeadCell>
            <Table.HeadCell>Modèle</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Prix de Location</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {filteredCars.map((car) => (
              <Table.Row key={car._id} className="bg-white">
                <Table.Cell>
                  {/* {car.images[0]} */}

                  <img
                    src={baseURL + "/" + car.images[0]}
                    alt={car.modele}
                    className="w-72 h-28 object-cover"
                  />
                </Table.Cell>

                <Table.Cell>{car.marque}</Table.Cell>
                <Table.Cell>{car.modele}</Table.Cell>
                <Table.Cell>{car.description}</Table.Cell>
                <Table.Cell > <span className="font-bold">{car.prixLocation} DT</span></Table.Cell>
                <Table.Cell>
               <Link
  to={`/admin/dashboard/manage-cars/update/${car._id}`}
  className="w-24 h-8 bg-teal-500 text-white font-medium flex items-center justify-center rounded-md hover:bg-teal-600 m-2"
>
  Modifier
</Link>

<Button
  color="failure"
  size="xs"
  className="w-24 h-8 bg-red-500 text-white font-medium flex items-center justify-center rounded-md hover:bg-red-600 m-2"
  onClick={() => handleDelete(car._id)}
>
  Supprimer
</Button>

<Link
  to={`/admin/dashboard/manage-cars/availability/${car._id}`}
  className="w-24 h-8 bg-teal-500 text-white font-medium flex items-center justify-center rounded-md hover:bg-teal-600 m-2"
>
  Disponibilité
</Link>

                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Alert color="warning" className="mt-4">
          Aucune voiture trouvée.
        </Alert>
      )}
    </div>
  );
}
