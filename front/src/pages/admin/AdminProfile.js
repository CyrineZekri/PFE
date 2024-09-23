import React, { useState, useEffect } from 'react';
import { Modal, Button, TextInput, Label, Spinner } from 'flowbite-react';
import useAdminService from '../../services/adminServices';
import { toast } from 'react-toastify';
import ProfilePic from "../../assets/userIcon.png"
export default function AdminProfile() {
  const { getAdminProfile, updateAdminProfile } = useAdminService();
  const [admin, setAdmin] = useState(null);
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
      const profile = await getAdminProfile();
      setAdmin(profile);
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
      const updatedProfile = await updateAdminProfile(formData);
      setAdmin(updatedProfile);
      toast.success("Profil mis à jour avec succès !");
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Erreur lors de la mise à jour du profil : ${error}`);
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
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Profil d'administrateur
      </h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="nom" value="Nom" />
          <TextInput id="nom" value={admin.nom} readOnly className="w-full" />
        </div>
        <div>
          <Label htmlFor="prenom" value="Prenom" />
          <TextInput id="prenom" value={admin.prenom} readOnly className="w-full" />
        </div>
        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput id="email" value={admin.email} readOnly className="w-full" />
        </div>
        <div>
          <Label htmlFor="telephone" value="Téléphone" />
          <TextInput id="telephone" value={admin.telephone} readOnly className="w-full" />
        </div>
        <div>
          <Label htmlFor="adresse" value="Adresse" />
          <TextInput id="adresse" value={admin.adresse} readOnly className="w-full" />
        </div>
      </div>
      <Button 
        className="mt-6 w-full bg-blue-600 hover:bg-blue-800" 
        onClick={() => setIsModalOpen(true)}
      >
       Mettre à jour le profil

      </Button>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Mettre à jour le profil
        </Modal.Header>
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
              className="w-full bg-blue-600 hover:bg-blue-800"
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : "Mettre à jour le profil"}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
