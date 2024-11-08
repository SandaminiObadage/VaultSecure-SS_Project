import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';


const OAuth = () => {
    const{googleLogin}=useAuthStore();
    
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
       try{
           await googleLogin();
           navigate('/');
         }catch(error){
           console.log(error.message);
         }
        
    };

    return (
        <div className="flex justify-center mt-6"> {/* Centers button horizontally */}
            <button
                type="button"
                onClick={handleGoogleClick}
                className="flex items-center px-4 py-2 bg-white hover:bg-green-600 text-black font-semibold rounded-lg shadow-md transition duration-300"
            >
                <AiFillGoogleCircle className="w-6 h-6 mr-2" />
                Continue with Google
            </button>
        </div>
    );
};

export default OAuth;
