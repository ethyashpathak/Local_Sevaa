import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getUserToken } from "./../../utils/cookies/getUserToken";
import { FaCheckCircle, FaStar, FaMapMarkerAlt, FaRegClock } from "react-icons/fa";

function ServicePerson({
    handyman_id,
    name,
    profile,
    distance,
    category
}) {
    const location = useLocation();
    const user_id = getUserToken();

    const lat = new URLSearchParams(location.search).get("lat");
    const long = new URLSearchParams(location.search).get("long");
    const cost = new URLSearchParams(location.search).get("cost") || "499"; // default mock if empty

    const [isLoading, setIsLoading] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);

    // Mock data for UI representation
    const rating = (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1); // random 4.5-5.0
    const etaMins = Math.max(5, Math.floor(distance * 10)); // rough estimate: 10 mins per km
    const displayTitle = category === "plumber" ? "Expert Plumber"
        : category === "electrician" ? "Professional Electrician"
            : category === "maid" ? "House Cleaning Expert"
                : "Professional Service";

    const displayRate = cost; // Or hardcode like 499

    const handleSelect = () => {
        setIsLoading(true);
        setShowCountdown(true);
        fetch(`${process.env.REACT_APP_BACKEND_API}/api/createnotification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lat: lat,
                long: long,
                user_id: user_id,
                handyman_id: handyman_id,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(true);
                setIsAccepted(false);
                const interval = setInterval(() => {
                    fetch(
                        `${process.env.REACT_APP_BACKEND_API}/api/getnotification/${handyman_id}`
                    )
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success && data.notifications && data.notifications[0]) {
                                const activeNotification = data.notifications[0];
                                if (activeNotification.status === "accepted") {
                                    setIsAccepted(true);
                                    setIsLoading(false);
                                    clearInterval(interval);
                                } else if (activeNotification.status === "rejected") {
                                    setIsAccepted(false);
                                    setIsLoading(false);
                                    clearInterval(interval);
                                }
                            }
                        });
                }, 3000);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    };

    return (
        <div className="servicePerson_card">
            <div className="servicePerson_top">
                <div className="servicePerson_profile">
                    <div className="servicePerson_image_wrapper">
                        <img src={profile || "https://i.ibb.co/6HMMXnZ/default-profile.png"} alt={name} className="servicePerson_image" />
                        <div className="servicePerson_verified">
                            <FaCheckCircle />
                        </div>
                    </div>
                    <div className="servicePerson_info">
                        <div className="servicePerson_name">{name}</div>
                        <div className="servicePerson_title">{displayTitle}</div>
                        <div className="servicePerson_meta">
                            <div className="meta_item">
                                <FaMapMarkerAlt />
                                <span>{distance.toFixed(1)} km</span>
                            </div>
                            <div className="meta_item">
                                <FaRegClock />
                                <span>{etaMins} mins</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="servicePerson_rating">
                    <FaStar style={{ fontSize: '10px' }} />
                    <span>{rating}</span>
                </div>
            </div>

            <div className="servicePerson_bottom">
                <div className="servicePerson_rate">
                    ₹{displayRate} <span>/ hr</span>
                </div>

                {isLoading ? (
                    <button className="book_btn" disabled>Waiting...</button>
                ) : isAccepted ? (
                    <Link
                        to={`/user/bookingsummary?lat=${lat}&long=${long}&cost=${cost}&handyman_id=${handyman_id}`}
                        style={{ textDecoration: 'none' }}
                    >
                        <button className="book_btn" style={{ backgroundColor: "#10b981" }}>
                            Move Forward
                        </button>
                    </Link>
                ) : showCountdown ? (
                    <button className="book_btn" style={{ backgroundColor: "#ef4444" }} disabled>Rejected</button>
                ) : (
                    <button className="book_btn" onClick={handleSelect}>Book Now</button>
                )}
            </div>
        </div>
    );
}

export default ServicePerson;
