import React, { useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUserToken } from "./../../../utils/cookies/getUserToken";
import { removeUserToken } from "./../../../utils/cookies/removeUserToken";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [loggedIn, setLoggedIn] = useState(!!getUserToken());

    const handleToggleMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const handleLogout = () => {
        removeUserToken();
        setLoggedIn(false);
        navigate("/user/login");
    };

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <div className="navbar_outer">
            <div className="container navbar_container">
                <nav className="main_nav">
                    <div className="logo">
                        <Link to="/">
                            <div>Local</div>
                            <div>Seva</div>
                        </Link>
                    </div>

                    <div className="search_bar_container">
                        <div className="search_bar">
                            <FaSearch />
                            <input type="text" placeholder="Search services..." />
                        </div>
                    </div>

                    <div className="menu_link">
                        <ul>
                            <li>
                                <Link to="/" className={isActive("/")}>Home</Link>
                            </li>
                            <li>
                                <Link to="/services/servicePage" className={isActive("/services/servicePage")}>Browse Services</Link>
                            </li>
                            <li>
                                <Link to="/handyman/register" className={isActive("/handyman/register")}>Be a Professional</Link>
                            </li>
                            <li>
                                <Link to="/user/bookingsummary" className={isActive("/user/bookingsummary")}>Payment History</Link>
                            </li>
                            <li>
                                <Link to="/handyman/login" className={isActive("/handyman/login")}>Role Toggle</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="profile_section">
                        {loggedIn ? (
                            <>
                                <img src="https://i.ibb.co/6HMMXnZ/default-profile.png" alt="Profile" className="profile_img" onClick={handleLogout} title="Logout" />
                                <span className="profile_name">Profile</span>
                            </>
                        ) : (
                            <Link to="/user/login" style={{ textDecoration: 'none', color: '#333', fontWeight: '600' }}>
                                Login
                            </Link>
                        )}
                    </div>

                    <div
                        className="mobile_menu_toggle"
                        onClick={handleToggleMenu}
                    >
                        <FaBars />
                    </div>
                </nav>

                <div
                    className={`mobile_menu_main ${
                        showMobileMenu ? "show" : ""
                    }`}
                >
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/services/servicePage">Browse Services</Link>
                        </li>
                        <li>
                            <Link to="/handyman/register">Be a Professional</Link>
                        </li>
                        <li>
                            {loggedIn ? (
                                <div onClick={handleLogout} style={{cursor: 'pointer', padding: '10px 20px', borderBottom: '1px solid #eee'}}>
                                    Logout
                                </div>
                            ) : (
                                <Link to="/user/login">Login</Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
