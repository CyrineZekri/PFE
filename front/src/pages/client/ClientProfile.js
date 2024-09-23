import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Label, Spinner } from 'flowbite-react';
import useClientService from '../../services/clientService';
import { toast } from 'react-toastify';

export default function ClientProfile() {
  const { getClientProfile, updateClientProfile } = useClientService();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
  });
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const profile = await getClientProfile();
      setClient(profile);
      setFormData({
        nom: profile.nom,
        prenom: profile.prenom,
        email: profile.email,
        telephone: profile.telephone,
        adresse: profile.adresse,
      });
      setLoading(false);
    } catch (error) {
      toast.error(`Erreur lors de la récupération du profil administrateur :
 ${error}`);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedProfile = await updateClientProfile(formData);
      setClient(updatedProfile);
      toast.success("Profil mis à jour avec succès !");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Erreur lors de la mise à jour du profil :
 ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return  (<div className="flex justify-center items-center h-screen p-4 w-full">
    <Spinner size="xl" />
  </div>);
  }
  return (
<div className="p-4 w-full bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Client Profile</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="nom" value="Nom" />
          <TextInput id="nom" value={client.nom} readOnly className="w-full" />
        </div>
        <div>
          <Label htmlFor="prenom" value="Prenom" />
          <TextInput id="prenom" value={client.prenom} readOnly className="w-full" />
        </div>
        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput id="email" value={client.email} readOnly className="w-full" />
        </div>
        <div>
          <Label htmlFor="telephone" value="Téléphone" />
          <TextInput id="telephone" value={client.telephone} readOnly className="w-full" />
        </div>
        <div>
          <Label htmlFor="adresse" value="Adresse" />
          <TextInput id="adresse" value={client.adresse} readOnly className="w-full" />
        </div>
      </div>
      <Button 
        className="mt-6 w-full bg-blue-600 hover:bg-blue-800" 
        onClick={() => setIsModalOpen(true)}
      >
    Mettre à jour le profil
      </Button>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Update Profile</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nom" value="Nom" />
              <TextInput 
                id="nom" 
                name="nom" 
                value={formData.nom} 
                onChange={handleInputChange} 
                required 
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="prenom" value="Prenom" />
              <TextInput 
                id="prenom" 
                name="prenom" 
                value={formData.prenom} 
                onChange={handleInputChange} 
                required 
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput 
                id="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="telephone" value="Téléphone" />
              <TextInput 
                id="telephone" 
                name="telephone" 
                value={formData.telephone} 
                onChange={handleInputChange} 
                required 
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="adresse" value="Adresse" />
              <TextInput 
                id="adresse" 
                name="adresse" 
                value={formData.adresse} 
                onChange={handleInputChange} 
                required 
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Mettre à jour le profil"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}
