import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {toast} from 'react-hot-toast';
import { FaPlus } from "react-icons/fa6";
import { Booking, ServiceRecord, Guest, Room, Service } from '../types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const Bookings: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [newBooking, setNewBooking] = useState<Booking>({
        id: '',
        roomNumber: '',
        guestId: '',
        amount: 0,
        paymentMethod: '',
        status: 'pending',
    });
    const [newServiceRecord, setNewServiceRecord] = useState<ServiceRecord>({
        id: '',
        guestId: '',
        amount: 0,
        paymentMethod: '',
        status: 'paid',
    });
    const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);

    useEffect(() => {
        fetchRooms();
        fetchGuests();
        fetchServices();
        fetchBookings();
        fetchServiceRecords();
    }, []);

    const fetchRooms = async () => {
        const response = await axios.get<Room[]>('http://localhost:3000/api/rooms?status=available');
        console.log(response.data, 'the rooms ');
        setRooms(response.data);
    };

    const fetchGuests = async () => {
        const response = await axios.get<Guest[]>('http://localhost:3000/api/guest');
        console.log(response.data, 'the guests');
        setGuests(response.data);
    };

    const fetchServices = async () => {
        const response = await axios.get<Service[]>('http://localhost:3000/api/services');
        console.log(response.data, 'the services ');
        setServices(response.data);
    };

    const fetchBookings = async () => {
        const response = await axios.get<Booking[]>('http://localhost:3000/api/bookings');
        setBookings(response.data);
    };

    const fetchServiceRecords = async () => {
        const response = await axios.get<ServiceRecord[]>('http://localhost:3000/api/bookings/service-records');
        setServiceRecords(response.data);
    };

    const handleCreateBooking = async () => {
        const staffObj = localStorage.getItem('user');
        const staff = JSON.parse(staffObj);
        const StaffId = staff.StaffId;

        const response = await axios.post<Booking>('http://localhost:3000/api/bookings', {
            roomNumber: newBooking.roomNumber,
            guestId: newBooking.guestId,
            amount: newBooking.amount,
            paymentMethod: newBooking.paymentMethod,
            StaffId,
        });
        console.log(response, 'The response for creating booking');
        toast.success('Booking created successfully!');
        fetchBookings();
        setShowBookingModal(false); // Close the modal after submission
    };

    const handleCreateServiceRecord = async () => {
        const staffObj = localStorage.getItem('user');
        const staff = JSON.parse(staffObj);
        const StaffId = staff.StaffId;

        const response = await axios.post<ServiceRecord>('http://localhost:3000/api/bookings/service-records', {
            guestId: newServiceRecord.guestId,
            amount: newServiceRecord.amount,
            paymentMethod: newServiceRecord.paymentMethod,
            StaffId,
        });
        console.log(response);
        toast.success('Service Record created successfully!');
        fetchServiceRecords();
        setShowServiceModal(false); // Close the modal after submission
    };

    const handleCheckout = async (bookingId: string, roomNumber: string) => {
        const response = await axios.post('http://localhost:3000/api/bookings/checkout', {
            bookingId,
            roomNumber,
        });
        console.log(response, 'Checkout response');
        fetchBookings(); // Refresh bookings after checkout
    };

    return (
        <div className='w-full h-full flex flex-col'>
            <div className="flex flex-row items-center justify-between p-2">
                <div className="flex flex-col">
                    <small>Bookings</small>
                    <h1>Group1 Hotel</h1>
                </div>
                <button className={"p-2 bg-[#079b31] flex flex-row items-center text-white "} onClick={() => setShowBookingModal(true)}>
                    <FaPlus /> Create New Booking
                </button>
                <button className={"p-2 bg-[#079b31] flex flex-row items-center text-white "} onClick={() => setShowServiceModal(true)}>
                    <FaPlus /> Create New Service Record
                </button>
            </div>

            {/* Modals */}
            {showBookingModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded w-1/3">
                        <h2 className="font-bold text-center text-2xl">Create New Booking</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateBooking();
                        }} className="flex flex-col">
                            <label className="mb-1">Select Room</label>
                            <select
                                className="border p-2 mb-3 rounded"
                                value={newBooking.roomNumber}
                                onChange={(e) => setNewBooking({ ...newBooking, roomNumber: e.target.value })}
                                required
                            >
                                <option value="">Select Room</option>
                                {rooms
                                    .filter(room => room.status === 'available') // Only available rooms
                                    .map(room => (
                                        <option key={room.roomNumber} value={room.roomNumber}>
                                            {room.roomNumber}
                                        </option>
                                    ))}
                            </select>

                            <label className="mb-1">Select Guest</label>
                            <select
                                className="border p-2 mb-3 rounded"
                                value={newBooking.guestId}
                                onChange={(e) => setNewBooking({ ...newBooking, guestId: e.target.value })}
                                required
                            >
                                <option value="">Select Guest</option>
                                {guests.map(guest => (
                                    <option key={guest.GuestId} value={guest.GuestId}>{`${guest.firstName} ${guest.lastName}`}</option>
                                ))}
                            </select>

                            <label className="mb-1">Amount</label>
                            <input
                                type="number"
                                className="border p-2 mb-3 rounded"
                                value={newBooking.amount}
                                onChange={(e) => setNewBooking({ ...newBooking, amount: parseFloat(e.target.value) })}
                                required
                            />

                            <label className="mb-1">Payment Method</label>
                            <input
                                type="text"
                                className="border p-2 mb-3 rounded"
                                value={newBooking.paymentMethod}
                                onChange={(e) => setNewBooking({ ...newBooking, paymentMethod: e.target.value })}
                                required
                            />

                            <Button variant="contained" color="primary" type="submit">Create Booking</Button>
                            <Button variant="contained" color="secondary" onClick={() => setShowBookingModal(false)} className="mt-2">
                                Close
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {showServiceModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded w-1/3">
                        <h2 className="font-bold text-center text-2xl">Create New Service Record</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateServiceRecord();
                        }} className="flex flex-col">
                            <label className="mb-1">Select Guest</label>
                            <select
                                className="border p-2 mb-3 rounded"
                                value={newServiceRecord.guestId}
                                onChange={(e) => setNewServiceRecord({ ...newServiceRecord, guestId: e.target.value })}
                                required
                            >
                                <option value="">Select Guest</option>
                                {guests.map(guest => (
                                    <option key={guest.GuestId} value={guest.GuestId}>{`${guest.firstName} ${guest.lastName}`}</option>
                                ))}
                            </select>

                            <label className="mb-1">Amount</label>
                            <input
                                type="number"
                                className="border p-2 mb-3 rounded"
                                value={newServiceRecord.amount}
                                onChange={(e) => setNewServiceRecord({ ...newServiceRecord, amount: parseFloat(e.target.value) })}
                                required
                            />

                            <label className="mb-1">Payment Method</label>
                            <input
                                type="text"
                                className="border p-2 mb-3 rounded"
                                value={newServiceRecord.paymentMethod}
                                onChange={(e) => setNewServiceRecord({ ...newServiceRecord, paymentMethod: e.target.value })}
                                required
                            />

                            <Button variant="contained" color="primary" type="submit">Create Service Record</Button>
                            <Button variant="contained" color="secondary" onClick={() => setShowServiceModal(false)} className="mt-2">
                                Close
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Data tables for bookings and service records */}
            <div className="flex flex-row justify-between overflow-auto mt-4">
                <div className="w-1/2 p-2">
                    <h3>Bookings</h3>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Guest</TableCell>
                                    <TableCell>Room</TableCell>
                                    <TableCell>Check-in Date</TableCell>
                                    <TableCell>Check-out Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {bookings.map((booking) => (
                                    <TableRow key={booking.BookingId}>
                                        <TableCell>{booking.BookingId}</TableCell>
                                        <TableCell>{guests.find(guest => guest.GuestId === booking.GuestId)?.firstName}</TableCell>
                                        <TableCell>{booking.roomNumber}</TableCell>
                                        <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {booking.Status === 'checked out' ? (
                                                <span className="bg-green-500 text-white px-2 py-1 rounded">Checked Out</span>
                                            ) : (
                                                <span>{booking.Status}</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {booking.Status !== 'checked out' && (
                                                <Button variant="contained" color="secondary" onClick={() => handleCheckout(booking.BookingId, booking.roomNumber)}>
                                                    Checkout
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div className="w-1/2 p-2">
                    <h3>Service Records</h3>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Guest</TableCell>
                                    <TableCell>Amount Paid</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {serviceRecords.map((serviceRecord) => (
                                    <TableRow key={serviceRecord.id}>
                                        <TableCell>{serviceRecord.id}</TableCell>
                                        <TableCell>{guests.find(guest => guest.GuestId === serviceRecord.GuestId)?.firstName}</TableCell>
                                        <TableCell>{serviceRecord.amount}</TableCell>
                                        <TableCell>{serviceRecord.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
