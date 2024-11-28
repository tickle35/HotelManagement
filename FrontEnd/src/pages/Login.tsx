import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/api/staff/login", {
                StaffId: email, // Assuming `email` is used as `StaffId`
                password
            });

            if (response.status === 200) {
                const userData = response.data.staff; // Assuming response data contains user details
                localStorage.setItem("user", JSON.stringify(userData)); // Save user data in local storage
                toast.success("Login successful!");
                navigate("/home");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    };


    return (
        <div className="flex bg-gray-100 w-full h-screen items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h1 className="font-bold text-3xl text-center text-[#079b31] mb-4">Hotel Management System</h1>
                <h2 className="text-xl text-center text-gray-700 mb-6">Login</h2>
                <form className="flex flex-col" onSubmit={handleLogin}>
                    <input
                        className="border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#079b31]"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-[#079b31]"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-[#079b31] text-white rounded-lg p-3 hover:bg-[#067a24] transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
