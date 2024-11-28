import  { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import {toast} from 'react-hot-toast'
import axios from 'axios';

export default function Services() {
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [newService, setNewService] = useState({
        ServiceName: '',
        inCharge: '',
        price: 0,
    });

    // Fetch all services
    const fetchServices = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/services');
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    // Fetch all staff members
    const fetchStaff = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/staff'); // Adjust the endpoint as needed
            console.log(response.data)
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching staff:', error);
        }
    };

    useEffect(() => {
        fetchServices();
        fetchStaff();
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/services', newService);
            toast.success('Booking created successfully!');
            setNewService({ ServiceName: '', inCharge: '', price: 0 });
            fetchServices(); // Refresh the services list
        } catch (error) {
            console.error('Error creating service:', error);
        }
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className="flex flex-row items-center justify-between p-2">
                <div className="flex flex-col">
                    <small>Services</small>
                    <h1>Group1 Hotel</h1>
                </div>
                <button className="bg-[#079b31] flex flex-row p-3 px-4 items-center justify-between rounded-sm text-white">
                    <FaPlus color="white" />
                    Create New Service Record
                </button>
            </div>
            <div className='flex flex-row w-full h-[90%] py-2 justify-between items-center'>
                <div className='bg-white w-[48%] h-full p-3 overflow-auto'>
                    <h1 className='font-bold text-lg'>All Services</h1>
                    <ul className="grid grid-cols-2 gap-4">
                        {services.map(service => (
                            <li key={service.serviceId} className='p-2 border rounded bg-[#079b31]'>
                                <strong>{service.ServiceName}</strong><br />
                                Price: ₵{service.price}<br />
                                Staff ID: {service.inCharge}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='bg-white w-[48%] h-full p-3'>
                    <h1 className='font-bold text-lg'>Add New Service</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Service Name"
                            value={newService.ServiceName}
                            onChange={(e) => setNewService({ ...newService, ServiceName: e.target.value })}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <select
                            value={newService.inCharge}
                            onChange={(e) => setNewService({ ...newService, inCharge: e.target.value })}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        >
                            <option value="">Select Staff</option>
                            {staff.map(staffMember => (
                                <option key={staffMember.id} value={staffMember.StaffId}>{staffMember.name}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Price"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                            required
                            className="border rounded p-2 mb-2 w-full"
                        />
                        <button type="submit" className="bg-[#079b31] text-white rounded p-2 w-full">Add Service</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
