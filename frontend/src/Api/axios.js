import axios from "axios";
import { refreshToken } from "../service/authService";
import { API_URL } from "../config";


const API = axios.create({
    baseURL: API_URL,
});



// Add access token
API.interceptors.request.use((config)=>{

    const accessToken =
        localStorage.getItem("accessToken");


    if(accessToken){

        config.headers.Authorization =
            `Bearer ${accessToken}`;

    }


    return config;

});




// Refresh expired token
API.interceptors.response.use(

    (response)=>{
        return response;
    },


    async(error)=>{


        const originalRequest = error.config;


        if(
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/refresh")
        ){

            originalRequest._retry = true;


            try{

                const data = await refreshToken();


                localStorage.setItem(
                    "accessToken",
                    data.accessToken
                );


                originalRequest.headers.Authorization =
                    `Bearer ${data.accessToken}`;


                return API(originalRequest);


            }catch(err){

                console.error(
                    "Refresh token failed",
                    err
                );


                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");


                window.location.href="/login";


                return Promise.reject(err);

            }

        }


        return Promise.reject(error);

    }

);


export default API;