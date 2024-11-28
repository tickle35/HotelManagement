import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

interface Guest {
  GuestId: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
}

const Guests: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [newGuest, setNewGuest] = useState<Omit<Guest, 'GuestId'>>({
    firstName: '',
    lastName: '',
    gender: 'male',
    email: '',
  });

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/guest");
      console.log(response.data);
      setGuests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching guests:", error);
      setGuests([]);
    }
  };

  const handleAddGuest = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/guest", newGuest);
      console.log(response.data);
      setOpenAddModal(false);
      setNewGuest({ firstName: '', lastName: '', gender: 'male', email: '' }); // Reset form
      fetchGuests();
    } catch (error) {
      console.error('Error adding guest:', error);
    }
  };

  const handleEditGuest = async () => {
    if (selectedGuest) {
      await axios.put(`http://localhost:3000/api/guests/${selectedGuest.GuestId}`, selectedGuest);
      setOpenEditModal(false);
      fetchGuests();
    }
  };

  const handleDeleteGuest = async () => {
    if (selectedGuest) {
      await axios.delete(`http://localhost:3000/api/guests/${selectedGuest.GuestId}`);
      setOpenDeleteModal(false);
      fetchGuests();
    }
  };

  return (
      <div className='w-full h-full flex flex-col'>
        <div className="flex flex-col">
          <small>Guest Management</small>
          <h1>Group1 Hotel</h1>
        </div>
        <div className='flex flex-row w-full h-[90%] justify-between items-start'>
          <div className='bg-white w-[50%] h-full p-1 m-1'>
            <h1 className='font-bold text-lg'>All Guests</h1>
            {guests.length === 0 ? (
                <p>No guests found.</p>
            ) : (
                <div className='overflow-x-auto'>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest ID</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {guests.map((guest) => (
                        <tr key={guest.GuestId}>
                          <td className="px-2 py-4 whitespace-nowrap">{guest.GuestId}</td>
                          <td className="px-2 py-4 whitespace-nowrap">{`${guest.firstName} ${guest.lastName}`}</td>
                          <td className="px-2 py-4 whitespace-nowrap">{guest.gender}</td>
                          <td className="px-2 py-4 whitespace-nowrap">{guest.email}</td>
                          <td className="px-2 py-4 whitespace-nowrap">
                            <Button onClick={() => {
                              setSelectedGuest(guest);
                              setOpenEditModal(true);
                            }}><Edit /></Button>
                            <Button onClick={() => {
                              setSelectedGuest(guest);
                              setOpenDeleteModal(true);
                            }}><Delete className={"text-red-600"} /></Button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
          <div className='bg-white w-[48%] h-full p-3'>
            <h1 className='font-bold text-lg'>Add New Guest</h1>

                <form className="flex flex-col" onSubmit={(e) => {
                  e.preventDefault();
                  handleAddGuest();
                }}>
                  <label className="mb-1">First Name</label>
                  <input
                      type="text"
                      placeholder="Enter first name"
                      className="border p-2 mb-3 rounded"
                      value={newGuest.firstName}
                      onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
                      required
                  />
                  <label className="mb-1">Last Name</label>
                  <input
                      type="text"
                      placeholder="Enter last name"
                      className="border p-2 mb-3 rounded"
                      value={newGuest.lastName}
                      onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
                      required
                  />
                  <label className="mb-1">Gender</label>
                  <select
                      className="border p-2 mb-3 rounded"
                      value={newGuest.gender}
                      onChange={(e) => setNewGuest({ ...newGuest, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <label className="mb-1">Email</label>
                  <input
                      type="email"
                      placeholder="Enter email"
                      className="border p-2 mb-3 rounded"
                      value={newGuest.email}
                      onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                      required
                  />
                  <button type="submit" className={"bg-green-500 p-2 text-white"}>Add Guest</button>
                </form>

          </div>
        </div>

        {/* Edit Modal */}
        <Modal open={openEditModal} className={"flex items-center justify-center"} onClose={() => setOpenEditModal(false)}>
          <div className='p-4 bg-white rounded w-[40%]'>
            <h2 className={"font-bold text-center text-2xl"}>Edit Guest</h2>
            {selectedGuest && (
                <form className="flex flex-col" onSubmit={(e) => {
                  e.preventDefault();
                  handleEditGuest();
                }}>
                  <label className="mb-1">First Name</label>
                  <input
                      type="text"
                      placeholder="Enter first name"
                      className="border p-2 mb-3 rounded"
                      value={selectedGuest.firstName}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, firstname: e.target.value })}
                      required
                  />
                  <label className="mb-1">Last Name</label>
                  <input
                      type="text"
                      placeholder="Enter last name"
                      className="border p-2 mb-3 rounded"
                      value={selectedGuest.lastName}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, lastname: e.target.value })}
                      required
                  />
                  <label className="mb-1">Gender</label>
                  <select
                      className="border p-2 mb-3 rounded"
                      value={selectedGuest.gender}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <label className="mb-1">Email</label>
                  <input
                      type="email"
                      placeholder="Enter email"
                      className="border p-2 mb-3 rounded"
                      value={selectedGuest.email}
                      onChange={(e) => setSelectedGuest({ ...selectedGuest, email: e.target.value })}
                      required
                  />
                  <Button onClick={handleEditGuest} variant="contained" style={{ backgroundColor: 'green', color: 'white' }}>Update Guest</Button>
                </form>
            )}
          </div>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal className={"flex items-center justify-center"} open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <div className='p-4 bg-white rounded w-[40%]'>
            <h2 className={"font-bold text-2xl"}>Confirm Deletion</h2>
            <p>Are you sure you want to delete {selectedGuest?.firstName} {selectedGuest?.lastName}?</p>
            <Button className={"ml-4"} onClick={handleDeleteGuest} variant="contained" color="secondary">Delete</Button>
            <Button onClick={() => setOpenDeleteModal(false)} variant="outlined">Cancel</Button>
          </div>
        </Modal>
      </div>
  );
};

export default Guests;
