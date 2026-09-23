import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import "./ProfessionalRegister.css";
import ProfessionalRegisterSecond from "./ProfessionalRegisterSecond";
import { FaShieldAlt, FaCheck, FaUpload, FaTimes } from "react-icons/fa";
import availableServices from "../../../utils/AvailableServices";

function ProfessionalRegister() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("12345678"); // Default or ask user later
    const [number, setNumber] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [aadharNumber, setAadharNumber] = useState("");
    
    // States for uploads
    const [aadharFront, setAadharFront] = useState("");
    const [aadharBack, setAadharBack] = useState("");

    const [verified, setVerified] = useState(false);
    const cookies = new Cookies();

    useEffect(() => {
        const handymanId = cookies.get("handyman_token");
        if (handymanId) {
            toast.success("Redirecting you ...");
            setTimeout(() => {
                navigate("/handyman/dashboard");
            }, 2000);
        }
    }, [navigate]);

    const handleAadharFrontImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setAadharFront(reader.result);
            };
        }
    };

    const handleAadharBackImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        if (file) {
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setAadharBack(reader.result);
            };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !name || !number || !selectedService || !aadharNumber) {
            toast.error("Please fill in all required fields");
            return;
        }

        const response = await fetch(
            `${process.env.REACT_APP_BACKEND_API}/api/handyman/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                }),
            }
        );
        try {
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.msg);
                setVerified(true);
            } else {
                toast.error(data.msg);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const onClose = () => {
        navigate("/");
    };

    return (
        <div className="pro_register_page">
            {verified ? (
                <ProfessionalRegisterSecond
                    name={name}
                    password={password}
                    email={email}
                    number={number}
                    selectedService={selectedService}
                    aadharNumber={aadharNumber}
                    aadharFront={aadharFront}
                    aadharBack={aadharBack}
                />
            ) : (
                <div className="pro_register_modal">
                    <button className="pro_close_btn" onClick={onClose}><FaTimes /></button>
                    
                    <div className="pro_register_left">
                        <div className="pro_register_title">Be a Professional</div>
                        <div className="pro_register_subtitle">Join Local Seva's network of trusted service providers.</div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="pro_register_form_grid">
                                <div className="pro_input_group">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="pro_input_group">
                                    <label>Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} 
                                    />
                                </div>
                                <div className="pro_input_group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="+91 98765 43210"
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)} 
                                    />
                                </div>
                                <div className="pro_input_group">
                                    <label>Primary Service</label>
                                    <select 
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                    >
                                        <option value="">Select a Service</option>
                                        {availableServices.map((service, idx) => (
                                            <option key={idx} value={service.serviceName}>{service.serviceName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pro_input_group full_width">
                                    <label>Aadhar ID Number</label>
                                    <input 
                                        type="text" 
                                        placeholder="XXXX-XXXX-XXXX"
                                        value={aadharNumber}
                                        onChange={(e) => setAadharNumber(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pro_upload_grid">
                                <label className="pro_upload_box">
                                    <input type="file" style={{display: 'none'}} onChange={handleAadharFrontImageUpload} accept="image/*" />
                                    <FaUpload />
                                    <span>{aadharFront ? "Front Uploaded" : "Aadhar Card Front"}</span>
                                </label>
                                <label className="pro_upload_box">
                                    <input type="file" style={{display: 'none'}} onChange={handleAadharBackImageUpload} accept="image/*" />
                                    <FaUpload />
                                    <span>{aadharBack ? "Back Uploaded" : "Aadhar Card Back"}</span>
                                </label>
                            </div>

                            <button type="submit" className="pro_submit_btn">Complete Registration</button>
                        </form>
                    </div>
                    
                    <div className="pro_register_right">
                        <div className="pro_verification_icon_wrapper">
                            <FaShieldAlt />
                            <div className="pro_verification_badge">
                                <FaCheck />
                            </div>
                        </div>
                        <div className="pro_verification_title">Secure Verification</div>
                        <div className="pro_verification_desc">
                            We value your privacy. All documents are encrypted and used only for professional background verification purposes.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfessionalRegister;
