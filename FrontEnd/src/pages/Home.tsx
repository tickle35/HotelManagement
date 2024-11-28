import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaPlus } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { FaBuildingCircleArrowRight } from "react-icons/fa6";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the required components
Chart.register(ArcElement, Tooltip, Legend);

type CardProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
};

const CardItems: CardProps[] = [
    { icon: <FaHome color="black" />, title: "Bookings", value: "0" },
    { icon: <FaBook color="black" />, title: "Available Rooms", value: "0" },
    { icon: <FaBuildingCircleArrowRight />, title: "Check ins", value: "0" },
    { icon: <MdOutlineLocalLaundryService />, title: "Check Outs", value: "0" }
];

const Card = ({ icon, title, value }: CardProps) => {
    return (
        <div className="w-[20%] h-[95%] bg-white flex flex-row items-center justify-center gap-10">
            <span className="bg-gray-200 rounded-sm flex items-center justify-center p-3">{icon}</span>
            <div className="bg-white rounded-md flex flex-col">
                <small className="text-black font-bold text-xs">{title}</small>
                <h1 className="text-black text-md font-bold">{value}</h1>
            </div>
        </div>
    );
};

export default function Home() {
    const [bookingCount, setBookingCount] = useState(0);
    const [availableRooms, setAvailableRooms] = useState(0);
    const [unavailableRooms, setUnavailableRooms] = useState(0);
    const [checkInCount, setCheckInCount] = useState(0);
    const [checkOutCount, setCheckOutCount] = useState(0);
    const chartRef = useRef(null); // Reference for the chart

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/dashboards');
                const { bookingCount, roomCounts, checkInOutCounts } = response.data;

                setBookingCount(bookingCount);
                setAvailableRooms(roomCounts.availableRooms);
                setUnavailableRooms(roomCounts.unavailableRooms);
                setCheckInCount(checkInOutCounts.checkInCount);
                setCheckOutCount(checkInOutCounts.checkOutCount);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchDashboardData();
    }, []);

    const chartData = {
        labels: ['Available Rooms', 'Unavailable Rooms'],
        datasets: [
            {
                data: [availableRooms, unavailableRooms],
                backgroundColor: ['#079b31', '#ff0000'],
            },
        ],
    };

    const updatedCardItems = CardItems.map((item) => {
        if (item.title === "Bookings") {
            return { ...item, value: bookingCount.toString() };
        }
        if (item.title === "Available Rooms") {
            return { ...item, value: availableRooms.toString() };
        }
        if (item.title === "Check ins") {
            return { ...item, value: checkInCount.toString() };
        }
        if (item.title === "Check Outs") {
            return { ...item, value: checkOutCount.toString() };
        }
        return item;
    });

    useEffect(() => {
        // Cleanup chart instance on unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="flex w-full h-full flex-col p-4 items-center justify-between">
            <div className="w-full h-[25%] flex flex-col justify-between">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                        <small>Home</small>
                        <h1>Group1 Hotel</h1>
                    </div>

                </div>
                <div className="w-full h-[70%] py-3 flex flex-row justify-between">
                    {updatedCardItems.map((item, index) => (
                        <Card key={index} icon={item.icon} title={item.title} value={item.value} />
                    ))}
                </div>
            </div>
            <div className="w-full h-[70%] flex flex-row items-center justify-between">
                <div className="bg-white w-[48%] h-[100%]">
                    <Doughnut ref={chartRef} data={chartData} /> {/* Use ref for the chart */}
                </div>
                <div className="w-[48%] h-[100%] flex flex-col justify-between">
                    <div className="bg-white h-[48%]"></div>
                    <div className="bg-white h-[48%]"></div>
                </div>
            </div>
        </div>
    );
}
