import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setHandymanToken } from "../../../utils/cookies/setHandymanToken";
import useGeoLocation from "../../../utils/useGeoLocation";
import "./ProfessionalRegister.css";
import { FaShieldAlt, FaCheck, FaTimes } from "react-icons/fa";

function ProfessionalRegisterSecond(props) {
    const navigate = useNavigate();
    const location = useGeoLocation();

    const [otp, setOtp] = useState("");
    const [address, setAddress] = useState("");
    const [profile, setProfile] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!otp) {
            toast.error("Please enter the OTP");
            return;
        }

        const data = {
            services: props.selectedService,
            name: props.name,
            email: props.email,
            otp: otp,
            password: props.password,
            phone: props.number,
            aadharNumber: props.aadharNumber,
            aadharFront: props.aadharFront || undefined,
            aadharBack: props.aadharBack || undefined,
            address: address,
            lat: location?.coordinates?.lat || "28.6139", // default if location fails
            long: location?.coordinates?.lng || "77.2090",
            profile: profile || undefined,
        };

        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_API}/api/handyman/signup/verify`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );
        
        try {
            const responseData = await response.json();
            if (response.status === 200) {
                toast.success(responseData.msg);
                setHandymanToken(responseData.handyman_id);
                toast.info("Redirecting you...");
                setTimeout(() => {
                    navigate("/handyman/dashboard");
                }, 3000);
            } else {
                toast.error(responseData.msg);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleResendOtp = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API}/api/user/signup/resendOtp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contactNumber: props.number,
                        email: props.email,
                    }),
                }
            );
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.msg);
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    return (
        <div className="pro_register_modal" style={{maxWidth: '600px'}}>
            <div className="pro_register_left" style={{flex: 1}}>
                <div className="pro_register_title" style={{textAlign: 'center', marginBottom: '20px'}}>Verify Email</div>
                <div className="pro_register_subtitle" style={{textAlign: 'center', marginBottom: '30px'}}>
                    We've sent an OTP to {props.email}. Please enter it below.
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="pro_input_group full_width" style={{marginBottom: '20px'}}>
                        <label>One Time Password (OTP)</label>
                        <input 
                            type="text" 
                            placeholder="Enter 4-digit OTP" 
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            style={{textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 'bold'}}
                        />
                    </div>
                    
                    <div className="pro_input_group full_width" style={{marginBottom: '20px'}}>
                        <label>Address (Optional)</label>
                        <input 
                            type="text" 
                            placeholder="Your Address" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="pro_input_group full_width" style={{marginBottom: '30px'}}>
                        <label>Profile Image URL (Optional)</label>
                        <input 
                            type="text" 
                            placeholder="https://..." 
                            value={profile}
                            onChange={(e) => setProfile(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="pro_submit_btn" style={{marginBottom: '15px'}}>Verify & Create Account</button>
                    
                    <div style={{textAlign: 'center'}}>
                        <span style={{fontSize: '13px', color: '#64748b'}}>Didn't receive code? </span>
                        <button type="button" onClick={handleResendOtp} style={{background: 'none', border: 'none', color: '#3b2a82', fontWeight: '600', cursor: 'pointer'}}>
                            Resend
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfessionalRegisterSecond;
