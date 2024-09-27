import React, { useState, useEffect } from "react";
import { Table, Spinner, Button, Modal, Select, Alert } from "flowbite-react";
import { toast } from "react-toastify";
import useAdminService from "../../../services/adminServices";

export default function AdminManageDemandes() {
  const {
    getAllReservations,
    getReservationById,
    acceptReservation,
    refuseReservation,
  } = useAdminService();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const baseURL = process.env.REACT_APP_API_URL;
  const [loadingModalData, setLoadingModalData] = useState({
    loading: false,
    id: null,
  });
  const [loadingAccepting , setLoadingAccepting] = useState({ loading: false,
    id: null,});
    const [loadingRefusing , setLoadingRefusing] = useState({ loading: false,
      id: null,});
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line
  }, []);
  const fetchReservations = async () => {
    try {
      const data = await getAllReservations();
      // eslint-disable-next-line
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

  const handleStatusChange = async (reservationId, status) => {
    try {
      if (status === "Accepted") {
        setLoadingAccepting({
          loading: true,
          id: reservationId,
        });
        await acceptReservation(reservationId);
        setLoadingAccepting({
          loading: false,
          id: null,
        });
      } else if (status === "Refused") {
        setLoadingRefusing({
          loading: true,
          id: reservationId,
        });
        await refuseReservation(reservationId);
        setLoadingRefusing({
          loading: false,
          id: null,
        });
      }
      toast.success(`Reservation ${status.toLowerCase()} successfully.`);
      setReservations(
        reservations.map((res) =>
          res._id === reservationId ? { ...res, status } : res
        )
      );
    } catch (error) {
      console.error(`Failed to ${status.toLowerCase()} reservation:`, error);
      toast.error(
        `An error occurred while ${status.toLowerCase()} the reservation.`
      );
      setLoadingAccepting({
        loading: false,
        id: null,
      });
      setLoadingRefusing({
        loading: false,
        id: null,
      });
    }
  };

  const openDetailsModal = async (reservationId) => {
    try {
      setLoadingModalData({
        loading: true,
        id: reservationId,
      });
      const reservation = await getReservationById(reservationId);
      setSelectedReservation(reservation);
      setShowModal(true);
    } catch (error) {
      console.error("Failed to fetch reservation details:", error);
      setLoadingModalData({
        loading: false,
        id: null,
      });
      toast.error("An error occurred while fetching reservation details.");
    } finally {
      setLoadingModalData({
        loading: false,
        id: null,
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
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
          <option value="Pending">En attente</option>
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
            <Table.HeadCell>Voiture
            </Table.HeadCell>
            <Table.HeadCell>Client</Table.HeadCell>
            <Table.HeadCell>Date de début</Table.HeadCell>
            <Table.HeadCell>Date de fin</Table.HeadCell>
            <Table.HeadCell>Statut
            </Table.HeadCell>
            <Table.HeadCell>Actes
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className={`divide-y`}> 
            {filteredReservations.map((reservation) => (
              <Table.Row
                key={reservation._id}
                className={`${
                  reservation.status === "Accepted" ? "bg-green-500/20" : reservation.status === "Refused" ? "bg-red-500/20" : "bg-yellow-500/20"
                }`}
              >
                <Table.Cell>{reservation && reservation.car.marque}</Table.Cell>
                <Table.Cell>{`${reservation.client?.nom} ${reservation.client?.prenom}`}</Table.Cell>
                <Table.Cell>
                  {new Date(reservation.dateDebut).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  {new Date(reservation.dateFin).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>{reservation.status}</Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    {reservation.status === "Pending" && (
                      <Button
                        size="xs"
                        onClick={() =>
                          handleStatusChange(reservation._id, "Accepted")
                        }
                        color="green"
                        disabled={
                          loadingAccepting.loading &&
                          loadingAccepting.id === reservation._id
                        }

                      >
                       

                        {
                          loadingAccepting.loading ?
                          loadingAccepting.id === reservation._id && (
                            <Spinner className="w-4 h-4" />
                          ) : " Confirmer"
                        }
                      </Button>
                    )}
                    {reservation.status === "Pending" && (
                      <Button
                        size="xs"
                        onClick={() =>
                          handleStatusChange(reservation._id, "Refused")
                        }
                        color="red"
                      >
                      
                       {
                        loadingRefusing.loading ?
                        loadingRefusing.id === reservation._id && (
                          <Spinner className="w-4 h-4" />
                        ) : " Refuser"
                       }
                      </Button>
                    )}
                    <Button
                      size="xs"
                      onClick={() => openDetailsModal(reservation._id)}
                      color="blue"
                      disabled={
                        loadingModalData.loading &&
                        loadingModalData.id === reservation._id
                      }
                    >
                      
                      {
                      
                      loadingModalData.loading ?
                        loadingModalData.id === reservation._id && (
                          <Spinner className="w-4 h-4" />
                        ) : "Plus de détails"
                    }
                    </Button>
                   
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal show={showModal} onClose={closeModal}>
      <Modal.Header className={`${selectedReservation?.status === "Accepted"
                    ? "bg-green-700"
                    : selectedReservation?.status === "Refused"
                    ? "bg-red-500"
                    : "bg-yellow-500"} text-white`}><div className="text-white">Détails de la réservation</div></Modal.Header>

        <Modal.Body>
          {selectedReservation && ( 
            
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

        {/* Client Details Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Détails du client</h2>
          <p><strong>Nom:</strong> {`${selectedReservation.client?.nom} ${selectedReservation.client?.prenom}`}</p>
          <p><strong>Email:</strong> {selectedReservation.client?.email}</p>
          <p><strong>Téléphone:</strong> {selectedReservation.client?.telephone}</p>
          <p><strong>Adresse:</strong> {selectedReservation.client?.adresse}</p>
        </div>

        {/* Reservation Details Section */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Détails de la réservation</h2>
          <p><strong>Date de début:</strong> {new Date(selectedReservation.dateDebut).toLocaleDateString()}</p>
          <p><strong>Date de fin:</strong> {new Date(selectedReservation.dateFin).toLocaleDateString()}</p>
          <p><strong>Statut:</strong> <span className={`${selectedReservation?.status === "Accepted"
                    ? "text-green-700"
                    : selectedReservation?.status === "Refused"
                    ? "text-red-500"
                    : "text-yellow-500"}`}></span>{selectedReservation?.status}</p>
          {/* <p><strong>Date d'ajout:</strong> {new Date(selectedReservation.dateAjout).toLocaleDateString()}</p> */}
          <p><strong>Nombre de jours:</strong> {Math.ceil((new Date(selectedReservation?.dateFin) - new Date(selectedReservation.dateDebut)) / (1000 * 60 * 60 * 24))} jours</p>
        </div>

        {/* Price Details Section */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Détails du prix</h2>
          <div className="flex justify-between">
            <p><strong>Prix total:</strong> <span className="text-blue-800 font-black">{Math.ceil((new Date(selectedReservation.dateFin) - new Date(selectedReservation.dateDebut)) / (1000 * 60 * 60 * 24)) * selectedReservation.car.prixLocation} DT</span></p>
          </div>
        </div>
      </div>

          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={closeModal}>Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}