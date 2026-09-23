import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { gethandymanToken } from "./../../../utils/cookies/getHandymanToken";
import {
    FaThLarge, FaTasks, FaEnvelope, FaMoneyBillWave, FaCog,
    FaMapMarkerAlt, FaCheckCircle, FaPhoneAlt, FaCommentDots, FaCheck,
    FaInbox, FaUserCircle
} from "react-icons/fa";
import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const handyman_id = gethandymanToken();

    const [activeTab, setActiveTab] = useState("Dashboard");
    const [liveStatus, setLiveStatus] = useState(true);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationData, setNotificationData] = useState(null);
    const [activeJob, setActiveJob] = useState(null);
    const [otpInputs, setOtpInputs] = useState(["", "", "", ""]);
    const [handymanInfo, setHandymanInfo] = useState(null);

    // Fetch the logged-in handyman's own profile on mount (for service type display)
    useEffect(() => {
        const fetchHandymanInfo = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/handyman/gethandyman`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ handyman_id }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setHandymanInfo(data);
                }
            } catch (err) {
                console.error("Failed to fetch handyman info", err);
            }
        };
        if (handyman_id) fetchHandymanInfo();
    }, [handyman_id]);

    // Helper: calculate distance between two lat/long pairs in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Poll for notifications every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!liveStatus) return;

            const getNotifications = async () => {
                try {
                    const response = await fetch(
                        `${process.env.REACT_APP_BACKEND_API}/api/getnotification/${handyman_id}`
                    );
                    const resData = await response.json();

                    if (resData.success && resData.notifications && resData.notifications.length > 0) {
                        const firstNotification = resData.notifications[0];

                        // Fetch the customer's full details from DB
                        try {
                            const userRes = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/user/getuser`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ user_id: firstNotification.user_id }),
                            });


                            if (userRes.ok) {
                                const userData = await userRes.json();
                                console.log(userData);

                                firstNotification.userName = userData.username || userData.name || "Customer";
                                firstNotification.userEmail = userData.email || "";
                                firstNotification.userPhone = userData.contactNumber || "";
                                firstNotification.userLat = userData.lat || "";
                                firstNotification.userLong = userData.long || "";
                            }
                        } catch (err) {
                            console.error("Failed to fetch user details", err);
                        }

                        // Calculate distance between handyman and customer request location
                        if (handymanInfo && firstNotification.lat && firstNotification.long) {
                            const dist = calculateDistance(
                                parseFloat(handymanInfo.lat),
                                parseFloat(handymanInfo.long),
                                parseFloat(firstNotification.lat),
                                parseFloat(firstNotification.long)
                            );
                            firstNotification.distance = dist ? dist.toFixed(1) : null;
                        }

                        if (firstNotification.status === "pending") {
                            setShowNotification(true);
                            setNotificationData(firstNotification);
                        } else if (firstNotification.status === "accepted") {
                            setShowNotification(false);
                            setActiveJob(firstNotification);
                        } else {
                            setShowNotification(false);
                            setNotificationData(null);
                        }
                    } else {
                        setShowNotification(false);
                        setNotificationData(null);
                    }
                } catch (error) {
                    console.error("Error fetching notifications", error);
                }
            };
            getNotifications();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [handyman_id, liveStatus, handymanInfo]);

    const handleAccept = async () => {
        if (!notificationData) return;
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API}/api/acceptnotification`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        handyman_id: notificationData.handyman_id,
                        user_id: notificationData.user_id,
                    }),
                }
            );
            const data = await response.json();
            if (response.status === 200) {
                toast.success("Job Accepted! OTP sent to customer.");
                setShowNotification(false);
                setActiveJob(notificationData);
                setNotificationData(null);
                setActiveTab("Active Tasks");
            } else {
                toast.error(data.msg || data.message);
            }
        } catch (error) {
            toast.error("Failed to accept job");
            console.error(error);
        }
    };

    const handleDecline = async () => {
        if (!notificationData) return;
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_API}/api/rejectnotification`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        handyman_id: notificationData.handyman_id,
                        user_id: notificationData.user_id,
                    }),
                }
            );
            if (response.status === 200) {
                toast.info("Job Declined");
                setShowNotification(false);
                setNotificationData(null);
            }
        } catch (error) {
            toast.error("Failed to decline job");
            console.error(error);
        }
    };

    const handleOtpChange = (index, value) => {
        const newOtp = [...otpInputs];
        newOtp[index] = value.slice(-1);
        setOtpInputs(newOtp);
        if (value && index < 3) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleStartService = async () => {
        const enteredOtp = otpInputs.join("");
        if (enteredOtp.length === 4) {
            toast.success("OTP Verified. Job Started!");
            navigate("/handyman/jobstartotp");
        } else {
            toast.error("Please enter complete 4-digit OTP");
        }
    };

    // Derive the service type label from handyman profile
    const serviceLabel = handymanInfo?.services
        ? handymanInfo.services.charAt(0).toUpperCase() + handymanInfo.services.slice(1) + " Service"
        : "Service";

    return (
        <div className="dashboard_page">
            <div className="dashboard_sidebar">
                <div className="sidebar_header">
                    <h2>{handymanInfo?.name || "Service Provider"}</h2>
                    <p>{serviceLabel} • Verified Pro</p>
                </div>

                <div className="sidebar_nav">
                    <div
                        className={`sidebar_item ${activeTab === 'Dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Dashboard')}
                    >
                        <FaThLarge /> Dashboard
                    </div>
                    <div
                        className={`sidebar_item ${activeTab === 'Active Tasks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('Active Tasks')}
                    >
                        <FaTasks /> Active Tasks
                    </div>
                    <div className="sidebar_item" onClick={() => toast.info("Feature coming soon")}>
                        <FaEnvelope /> Messages
                    </div>
                    <div className="sidebar_item" onClick={() => toast.info("Feature coming soon")}>
                        <FaMoneyBillWave /> Earnings
                    </div>
                    <div className="sidebar_item" onClick={() => toast.info("Feature coming soon")}>
                        <FaCog /> Settings
                    </div>
                </div>

                <div className="sidebar_footer">
                    <button className="switch_btn" onClick={() => navigate("/")}>Switch to Customer</button>
                </div>
            </div>

            <div className="dashboard_main">
                {activeTab === "Dashboard" && (
                    <>
                        <div className="dash_top_bar">
                            <div className="live_status_info">
                                <h3><div className="status_dot"></div> Live Status</h3>
                                <p>{liveStatus ? "You are currently receiving requests" : "You are currently offline"}</p>
                            </div>
                            <div className="toggle_switch"
                                style={{ backgroundColor: liveStatus ? '#3b2a82' : '#cbd5e1' }}
                                onClick={() => setLiveStatus(!liveStatus)}
                            >
                                <div className="toggle_circle" style={{ transform: liveStatus ? 'translateX(0)' : 'translateX(-22px)' }}></div>
                            </div>
                        </div>

                        <div className="dash_content_grid">
                            <div className="dash_left_col">
                                {/* Show the request card ONLY if a real notification exists */}
                                {showNotification && notificationData ? (
                                    <div className="new_request_card">
                                        <div className="request_map_placeholder">
                                            <div className="map_placeholder_bg">
                                                <FaMapMarkerAlt className="map_center_pin" />
                                            </div>
                                        </div>
                                        <div className="request_info">
                                            <div className="request_badge">New Request!</div>
                                            <div className="request_header">
                                                <div className="request_user">
                                                    <h3>{notificationData.userName}</h3>
                                                    <div className="request_location">
                                                        <FaMapMarkerAlt />
                                                        {notificationData.distance
                                                            ? ` ${notificationData.distance} km away`
                                                            : " Nearby"}
                                                    </div>
                                                </div>
                                                <div className="request_fee">
                                                    <p>Estimated Fee</p>
                                                    <h4>₹450 - ₹600</h4>
                                                </div>
                                            </div>
                                            <div className="job_details_box">
                                                <h5>JOB DETAILS</h5>
                                                <p>{serviceLabel} request from <strong>{notificationData.userName}</strong></p>
                                                {notificationData.userEmail && (
                                                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                                        Contact: {notificationData.userEmail}
                                                        {notificationData.userPhone ? ` • ${notificationData.userPhone}` : ""}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="request_actions">
                                                <button className="btn_accept" onClick={handleAccept}>
                                                    <FaCheckCircle /> Accept
                                                </button>
                                                <button className="btn_decline" onClick={handleDecline}>
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : activeJob ? (
                                    <div className="no_requests_box">
                                        <FaCheckCircle className="no_requests_icon" style={{ color: '#10b981' }} />
                                        <h3>Active Job In Progress</h3>
                                        <p>You have an active {serviceLabel.toLowerCase()} job with <strong>{activeJob.username || "a customer"}</strong>. Go to <strong>'Active Tasks'</strong> to continue.</p>
                                        <button className="go_active_btn" onClick={() => setActiveTab("Active Tasks")}>
                                            Go to Active Tasks
                                        </button>
                                    </div>
                                ) : (
                                    <div className="no_requests_box">
                                        <FaInbox className="no_requests_icon" />
                                        <h3>No customer requests found</h3>
                                        <p>You have no pending {serviceLabel.toLowerCase()} requests right now. New requests will appear here automatically when a customer books your service.</p>
                                    </div>
                                )}
                            </div>

                            <div className="dash_right_col">
                                <div className="completion_history">
                                    <h3 className="history_title">Completion History</h3>
                                    <div className="history_list">
                                        <div className="history_item">
                                            <div className="history_info">
                                                <div className="history_icon"><FaCheck /></div>
                                                <div className="history_details">
                                                    <h5>Sarah M.</h5>
                                                    <p>General Plumbing • 2h ago</p>
                                                </div>
                                            </div>
                                            <div className="history_amount">₹1,200</div>
                                        </div>
                                        <div className="history_item">
                                            <div className="history_info">
                                                <div className="history_icon"><FaCheck /></div>
                                                <div className="history_details">
                                                    <h5>Vikram K.</h5>
                                                    <p>Electrical Fix • Yesterday</p>
                                                </div>
                                            </div>
                                            <div className="history_amount">₹850</div>
                                        </div>
                                        <div className="history_item">
                                            <div className="history_info">
                                                <div className="history_icon"><FaCheck /></div>
                                                <div className="history_details">
                                                    <h5>Ananya S.</h5>
                                                    <p>AC Servicing • 2 days ago</p>
                                                </div>
                                            </div>
                                            <div className="history_amount">₹2,400</div>
                                        </div>
                                    </div>
                                    <a href="#" className="view_all_history">View All History</a>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "Active Tasks" && (
                    <div className="dash_content_grid">
                        <div className="dash_left_col">
                            {activeJob ? (
                                <div className="active_job_card">
                                    <div className="active_job_header">
                                        <div className="active_user_info">
                                            <div className="active_user_avatar">
                                                {(activeJob.userName || "C").charAt(0).toUpperCase()}
                                            </div>
                                            <div className="active_user_details">
                                                <p>Active Job • {serviceLabel}</p>
                                                <h4>Contact {activeJob.userName || "Customer"}</h4>
                                                {activeJob.userEmail && (
                                                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                                                        {activeJob.userEmail}
                                                        {activeJob.userPhone ? ` • ${activeJob.userPhone}` : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="contact_actions">
                                            <button className="icon_btn"><FaPhoneAlt style={{ fontSize: '14px' }} /></button>
                                            <button className="icon_btn"><FaCommentDots style={{ fontSize: '14px' }} /></button>
                                        </div>
                                    </div>

                                    <div className="otp_section">
                                        <p>Enter the 4-digit OTP provided by the customer to start the job.</p>
                                        <div className="otp_inputs">
                                            {otpInputs.map((val, idx) => (
                                                <input
                                                    key={idx}
                                                    id={`otp-${idx}`}
                                                    type="text"
                                                    maxLength="1"
                                                    value={val}
                                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                />
                                            ))}
                                        </div>
                                        <button className="start_service_btn" onClick={handleStartService}>
                                            Start Service
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="no_requests_box">
                                    <FaInbox className="no_requests_icon" />
                                    <h3>No active tasks</h3>
                                    <p>You don't have any active jobs right now. Accept a request from the Dashboard to get started.</p>
                                    <button className="go_active_btn" onClick={() => setActiveTab("Dashboard")}>
                                        Go to Dashboard
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="dash_right_col">
                            {/* Empty right column */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
