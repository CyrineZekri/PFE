import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Modal, Select, Alert } from "flowbite-react";
import { toast } from "react-toastify";
import useClientService from "../../services/clientService";

export default function MyReservations() {
  const { getClientReservations } = useClientService();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const baseURL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const data = await getClientReservations();
      setReservations(data);
      setFilteredReservations(data);
      setLoading(false);
    } catch (error) {
      console.error("Échec de la récupération des réservations :", error);
      toast.error("Une erreur s'est produite lors de la récupération des réservations.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (statusFilter === "All") {
      setFilteredReservations(reservations);
    } else {
      setFilteredReservations(
        reservations.filter((res) => res.status === statusFilter)
      );
    }
  }, [statusFilter, reservations]);

  const handleDetailsClick = (reservation) => {
    setSelectedReservation(reservation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-500 text-white";
      case "Refused":
        return "bg-red-500 text-white";
      case "Pending":
        return "bg-yellow-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold mb-4">Gérer les réservations</h2>

      <div className="mb-4">
        <Select
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
          className="w-48"
        >
          <option value="All">All</option>
          <option value="Pending">En attente
          </option>
          <option value="Accepted">Accepté</option>
          <option value="Refused">Refusé</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : filteredReservations.length === 0 ? (
        <Alert color="info">Aucune réservation trouvée.
</Alert>
      ) : (
        <Table hoverable={true}>
          <Table.Head>
            <Table.HeadCell>Voiture</Table.HeadCell>
            <Table.HeadCell>Image de voiture
            </Table.HeadCell>
            <Table.HeadCell>Date de début
            </Table.HeadCell>
            <Table.HeadCell>Date de fin
            </Table.HeadCell>
            <Table.HeadCell>Statut</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {filteredReservations.map((reservation) => (
              //////////// colors ////////////////////////// 
              <Table.Row
                key={reservation._id}
                className={`${
                  reservation.status === "Accepted"
                    ? "bg-green-500/20"
                    : reservation.status === "Refused"
                    ? "bg-red-500/20"
                    : "bg-yellow-500/20"
                }`}
              >
               
                <Table.Cell>{reservation.car.marque}</Table.Cell>
                <Table.Cell>
                  <img
                    className="w-40"
                    src={baseURL + "/" + reservation.car.images[0]}
                    alt={reservation.car.marque}
                  />
                </Table.Cell>
                <Table.Cell>
                  {new Date(reservation.dateDebut).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {new Date(reservation.dateFin).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{reservation.status}</Table.Cell>
                <Table.Cell>
                  <Button
                    size="xs"
                    onClick={() => handleDetailsClick(reservation)}
                  >
                    Details
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {showModal && selectedReservation && (
        <Modal show={showModal} onClose={handleCloseModal}>
         
          <Modal.Header  className={`${getStatusColor(
                selectedReservation.status
              )}
              
              `}>
            <span
              className={`font-bold ${getStatusColor(
                selectedReservation.status
              )}
              
              `}
            >
             Réservation N {(selectedReservation._id).slice(0,5)} : {selectedReservation.status}
            </span>
          </Modal.Header>
          <Modal.Body>
          <div className="p-4 space-y-4">
        {/* Car Details Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Détails de la voiture</h2>
         <div className="flex gap-6">
       <div>
       <p><strong>Marque:</strong> {selectedReservation.car.marque}</p>
          <p><strong>Modèle:</strong> {selectedReservation.car.modele}</p>
          <p><strong>Prix par jour:</strong> {selectedReservation.car.prixLocation} DT</p>
       </div>
       <div>
        <img src={baseURL + "/" + selectedReservation.car.images[0]} alt="car" className="w-60 h-32 object-cover" />
       </div>
         </div>
        </div>
 

        {/* Reservation Details Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Détails de la réservation</h2>
          <p><strong>Date de début:</strong> {new Date(selectedReservation.dateDebut).toLocaleDateString()}</p>
          <p><strong>Date de fin:</strong> {new Date(selectedReservation.dateFin).toLocaleDateString()}</p>
          <p><strong>Statut:</strong> {selectedReservation.status}</p>
          {/* <p><strong>Date d'ajout:</strong> {new Date(selectedReservation.dateAjout).toLocaleDateString()}</p> */}
          <p><strong>Nombre de jours:</strong> {Math.ceil((new Date(selectedReservation.dateFin) - new Date(selectedReservation.dateDebut)) / (1000 * 60 * 60 * 24))} jours</p>
        </div>

        {/* Price Details Section */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Détails du prix</h2>
          <div className="flex justify-between">
            <p><strong>Prix total:</strong> <span className="text-blue-800 font-black">{Math.ceil((new Date(selectedReservation.dateFin) - new Date(selectedReservation.dateDebut)) / (1000 * 60 * 60 * 24)) * selectedReservation.car.prixLocation} DT</span></p>
          </div>
        </div>
      </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
