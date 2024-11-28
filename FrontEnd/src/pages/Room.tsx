import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';
interface Room {
    id: number;
    roomNumber: string;
    type: string;
    description: string;
    status: 'available' | 'occupied';
}

const RoomComponent: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [newRoom, setNewRoom] = useState<{ type: string; description: string; status: 'available' | 'occupied' }>({
        type: '',
        description: '',
        status: 'available',
    });
    const [editRoom, setEditRoom] = useState<Room | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const response = await axios.get<Room[]>("http://localhost:3000/api/rooms");
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    const handleAddRoom = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/api/rooms", newRoom);
            toast.success('Booking created successfully!');
            setNewRoom({ type: '', description: '', status: 'available' });
            fetchRooms();
        } catch (error) {
            console.error("Error adding room:", error);
        }
    };

    const handleEditRoom = (room: Room) => {
        setEditRoom(room);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditRoom(null);
    };

    const handleUpdateRoom = async () => {
        if (editRoom) {
            try {
                await axios.put(`http://localhost:3000/api/rooms/${editRoom.roomNumber}`, editRoom);
                fetchRooms();
                handleModalClose();
            } catch (error) {
                console.error("Error updating room:", error);
            }
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className="flex flex-col">
                <small>Rooms</small>
                <h1>Group1 Hotel</h1>
            </div>
            <div className='flex flex-row w-full h-[90%] py-2 justify-between items-start'>
                <div className='bg-white w-[48%] h-full p-3 overflow-auto'>
                    <h1 className='font-bold text-lg'>All Rooms</h1>
                    <ul className="grid grid-cols-5 gap-4">
                        {rooms.map(room => (
                            <li key={room.id}
                                className={`flex justify-between items-center p-2 rounded text-white ${room.status === 'available' ? 'bg-green-500' : 'bg-red-500'} mb-2`}>
                                <span>{room.roomNumber}</span>
                                <button onClick={() => handleEditRoom(room)} className="">
                                    ✏️
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='bg-white w-[48%] h-[50%] p-3'>
                    <h1 className='font-bold text-lg'>Add New Room</h1>
                    <form onSubmit={handleAddRoom}>
                        <input
                            type="text"
                            placeholder="Room Type"
                            value={newRoom.type}
                            onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <textarea
                            placeholder="Description"
                            value={newRoom.description}
                            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <select
                            value={newRoom.status}
                            onChange={(e) => setNewRoom({ ...newRoom, status: e.target.value as 'available' | 'occupied' })}
                            className="border rounded p-2 mb-2 w-full"
                        >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                        </select>
                        <button type="submit" className="bg-green-500 text-white rounded p-2 w-full">Add Room</button>
                    </form>
                </div>
            </div>

            {/* Modal for Editing Room */}
            {isModalOpen && editRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <h2 className="font-bold text-lg">Edit Room</h2>
                        <input
                            type="text"
                            value={editRoom.type}
                            onChange={(e) => setEditRoom({ ...editRoom, type: e.target.value })}
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <textarea
                            value={editRoom.description}
                            onChange={(e) => setEditRoom({ ...editRoom, description: e.target.value })}
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <select
                            value={editRoom.status}
                            onChange={(e) => setEditRoom({ ...editRoom, status: e.target.value as 'available' | 'occupied' })}
                            className="border rounded p-2 mb-2 w-full"
                        >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                        </select>
                        <button onClick={handleUpdateRoom} className="bg-blue-500 text-white rounded p-2 w-full">Update Room</button>
                        <button onClick={handleModalClose} className="mt-2 text-red-500">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomComponent;
