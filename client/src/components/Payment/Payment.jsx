import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import "./Payment.css";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
    });
    
    // We expect total to come from query params, but fallback to 599 for UI preview
    const totalParam = new URLSearchParams(location.search).get("total") || "599";
    const baseFee = parseFloat(totalParam);
    const platformFee = 100;
    const finalTotal = baseFee + platformFee;

    useEffect(() => {
        setProduct({
            name: "Local Seva Booking",
            price: finalTotal * 100,
            description: `Payment for professional services via Local Seva`,
        });
    }, [finalTotal]);

    const handleToken = async (token, addresses) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API}/api/config`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        product,
                        addresses,
                    }),
                }
            );
            const data = await response.json();
            if (data.status === "success") {
                alert("Payment Successful");
                navigate("/");
            } else {
                console.error(`Failed with status code ${response.status}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="payment_page">
            <div className="payment_container">
                <div className="payment_left">
                    <div className="payment_title">Complete Your Booking</div>
                    <div className="payment_subtitle">Secure your appointment with our verified service professionals.</div>

                    <div className="payment_form_card">
                        <div className="payment_secure_badge">
                            <FaLock /> SECURE STRIPE PAYMENT
                        </div>

                        {/* Dummy UI for the mock inline form. 
                            The actual processing is done by the StripeCheckout popup when "Pay Now" is clicked. */}
                        <div className="payment_input_group">
                            <label>Cardholder Name</label>
                            <input type="text" placeholder="John Doe" />
                        </div>

                        <div className="payment_input_group">
                            <label>Card Number</label>
                            <input type="text" placeholder="0000 0000 0000 0000" />
                            <FaCreditCard className="payment_input_icon" />
                        </div>

                        <div className="payment_input_row">
                            <div className="payment_input_group">
                                <label>Expiry (MM/YY)</label>
                                <input type="text" placeholder="12/26" />
                            </div>
                            <div className="payment_input_group">
                                <label>CVC</label>
                                <input type="text" placeholder="***" />
                            </div>
                        </div>

                        <StripeCheckout
                            className="stripe-checkout-wrapper"
                            stripeKey={process.env.REACT_APP_STRIPE_KEY}
                            amount={finalTotal * 100}
                            token={handleToken}
                            name="Local Seva Payment"
                            currency="INR"
                        >
                            <button className="pay_btn">
                                Pay Now ₹{finalTotal.toFixed(2)} <FaShieldAlt />
                            </button>
                        </StripeCheckout>

                        <div className="payment_powered_by">
                            Powered by <strong>stripe</strong>
                        </div>
                    </div>
                </div>

                <div className="payment_right">
                    <div className="summary_title">Order Summary</div>
                    
                    <div className="summary_service_card">
                        <img src="https://i.ibb.co/6HMMXnZ/default-profile.png" alt="Service" className="summary_service_img" />
                        <div className="summary_service_info">
                            <div className="summary_service_name">Service Booking</div>
                            <div className="summary_service_provider">Verified Pro</div>
                        </div>
                    </div>

                    <div className="summary_row">
                        <span>Service Base Fee</span>
                        <span>₹{baseFee.toFixed(2)}</span>
                    </div>
                    <div className="summary_row">
                        <span>Platform Fee</span>
                        <span>₹{platformFee.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary_row total">
                        <span>Total Amount</span>
                        <span className="amount">₹{finalTotal.toFixed(2)}</span>
                    </div>

                    <div className="summary_guarantee">
                        <FaShieldAlt />
                        <p>Our Happiness Guarantee covers every booking. Your money is held securely until the task is complete.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
