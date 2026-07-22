import image1 from '../../../assets/image copy.png';
import { PATH } from '../../../path.js';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { register } from "../../../service/authService.js";
const RightSection_signUp = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await register({
                full_name: fullName,
                email,
                password,
            });

            alert("Account created successfully");

            navigate(PATH.AUTH.LOGIN);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };
    return (
        <div className="left-section rounded-r-2xl flex flex-col bg-gray-100 justify-center px-6 sm:px-16 lg:px-32 py-10">
            <div className="welcome-message flex flex-col gap-2 py-4">
                <h2 className="text-4xl text-[#004953] font-bold">Create Your account</h2>
                <p className=" text-[#004953]">join Creave24 and start your food journey</p>
            </div>
            <form onSubmit={handleRegister} className="login-form flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="border border-gray-500 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="border border-gray-500 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" id="email" placeholder="Email address" required />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className="border border-gray-500 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" id="password" placeholder="Password" required />
                </div>

                <button className="btn-press bg-[#004953] text-white mt-2 py-2 px-4 rounded-lg hover:bg-black transition duration-200">Sign Up</button>
                <div className="or-divider my-1 justify-center flex items-center gap-4">
                    <p className="text-gray-600">or continue with</p>
                </div>
                <div className="social-login flex flex-col gap-4 ">
                    <button className="btn-press border border-gray-500 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-[#004953] hover:text-white transition duration-200">
                        <img src={image1} alt="Google" className="w-5 h-5" />
                        sign in with Google
                    </button>
                </div>
                <div className="signup-link flex justify-center mt-2">
                    <p className="text-gray-600 justify-center">Already have an account? <span onClick={() => navigate(PATH.AUTH.LOGIN)} className="text-[#004953] cursor-pointer">Log in</span></p>
                </div>
            </form>
        </div>
    );
}
export default RightSection_signUp;