import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Payment } from '../types';

const Payments: React.FC = () => {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get<Payment[]>('http://localhost:3000/api/payments');
            console.log(response,'the payments')
            setPayments(response.data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    return (
        <div className='w-full h-full flex flex-col justify-evenly'>
                <div className="flex flex-col h-[10%]">
                    <small>Home</small>
                    <h1>Group1 Hotel</h1>
                </div>

            <TableContainer className={"h-[80%]"} component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Payment Method</TableCell>
                            <TableCell>Staff ID</TableCell>
                            <TableCell>Item ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.id}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>{payment.paymentMethod}</TableCell>
                                <TableCell>{payment.StaffId}</TableCell>
                                <TableCell>{payment.itemId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default Payments;
