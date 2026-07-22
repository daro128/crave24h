import image1 from '../../../assets/image.png';
import image2 from '../../../assets/image copy.png';
import image3 from '../../../assets/image copy 2.png'
import {PATH} from '../../../path.js';
import {useNavigate} from 'react-router-dom';
const LeftSection_login = () => {
    const navigate = useNavigate();
    return (
        <div className="left-section flex flex-col justify-center px-6 sm:px-16 lg:px-32 py-10">
            <div className="welcome-message flex flex-col gap-2 py-4">
                <h2 className="text-4xl text-[#004953] font-bold">Welcome Back!</h2>
                <p className=" text-[#004953]">Your cravings are just a few clicks away.</p>
            </div>
            <div className="login-form flex flex-col gap-4">
                <div className="flex flex-col">
                    <label htmlFor="username">Username</label>
                    <input className="border border-gray-500 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" id="username" placeholder="Username" required />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="email">Email</label>
                    <input className="border border-gray-500 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" id="email" placeholder="Email address" required />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="password">Password</label>
                    <input className="border border-gray-500 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" id="password" placeholder="Password" required />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember Me</label>
                    </div>
                    <p>Forgot Password?</p>
                </div>
                <button className="btn-press bg-[#004953] text-white py-2 px-4 rounded-lg hover:bg-black transition duration-200">Login</button>
                <div className="or-divider my-1 justify-center flex items-center gap-4">
                    <p className="text-gray-600">or continue with</p>
                </div>
                <div className="social-login flex flex-col gap-4 ">
                    <button className="btn-press border border-gray-500 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-[#004953] hover:text-white transition duration-200">
                        <img src={image1} alt="Google" className="w-5 h-5" />
                        sign in with Google
                    </button>
                    <button className="btn-press border border-gray-500 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-[#004953] hover:text-white transition duration-200">
                        <img src={image2} alt="Facebook" className="w-5 h-5" />
                        sign in with Facebook
                    </button>
                    <button className="btn-press border border-gray-500 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-[#004953] hover:text-white transition duration-200">
                        <img src={image3} alt="Apple" className="w-5 h-5" />
                        sign in with Apple
                    </button>
                </div>
                <div className="signup-link flex justify-center mt-2">
                    <p className="text-gray-600 justify-center">Don't have an account? <span onClick={()=>navigate(PATH.USER.SIGNUP)} className="text-[#004953] cursor-pointer">Sign up</span></p>
                </div>
            </div>
        </div>
    );
}
export default LeftSection_login;