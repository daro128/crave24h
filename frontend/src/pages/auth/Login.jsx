import LeftSection_login from "../../components/userComponent/Login&SignUpComponent/LeftSection_login";
import RightSection_login from "../../components/userComponent/Login&SignUpComponent/RightSection_login";
const Login = ()=>{
    
    return(
        <div>
            <div className="signup-page grid grid-cols-1 lg:grid-cols-2 h-screen">
                <LeftSection_login />
                <RightSection_login />
            </div>
        </div>
    )
}
export default Login;