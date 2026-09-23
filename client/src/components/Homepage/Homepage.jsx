import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaSearch, FaShieldAlt, FaStar, FaAward, FaBolt,
    FaArrowDown, FaUserTie, FaCheckCircle, FaLock
} from "react-icons/fa";
import "./Homepage.css";

// Importing local images
import service_1 from "./Components/OurServices/images/service_1.png";
import service_2 from "./Components/OurServices/images/service_2.png";
import service_3 from "./Components/OurServices/images/service_3.png";
import service_4 from "./Components/OurServices/images/service_4.png";
import service_5 from "./Components/OurServices/images/service_5.png";
import service_6 from "./Components/OurServices/images/service_6.png";
import services_bottom from "./Components/OurServices/images/services_bottom.png";

import oneclick_1 from "./Components/OneClick/images/oneclick_1.png";
import oneclick_2 from "./Components/OneClick/images/oneclick_2.png";
import oneclick_3 from "./Components/OneClick/images/oneclick_3.png";
import oneclick_4 from "./Components/OneClick/images/oneclick_4.png";

import joinourteam from "./Components/JoinOurTeam/images/joinourteam.png";

function Homepage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [scrollOpacity, setScrollOpacity] = useState(1);

    // List of available services
    const services = [
        { id: 1, name: "Carpenter", image: service_1, pathName: "carpenter", description: "Furniture repairs, assemblies & premium woodworks" },
        { id: 2, name: "Maid", image: service_2, pathName: "maid", description: "Deep cleaning, dusting & customized home upkeep" },
        { id: 3, name: "Plumber", image: service_3, pathName: "plumber", description: "Leaking fixes, installation & complete sanitation" },
        { id: 4, name: "Garbage Collector", image: service_4, pathName: "garbage collector", description: "Regular garbage disposal & environment cleanliness" },
        { id: 5, name: "All Rounder", image: service_5, pathName: "all rounder", description: "Versatile repairs, help & miscellaneous support" },
        { id: 6, name: "Electrician", image: service_6, pathName: "electrician", description: "Wiring installations, fixtures & prompt troubleshooting" },
    ];

    // Filter services based on search query
    const filteredSuggestions = services.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Fade out hero content slightly as user scrolls down
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const maxScroll = 300;
            const opacity = Math.max(0, 1 - currentScroll / maxScroll);
            setScrollOpacity(opacity);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Find matched service
            const matched = services.find(
                (s) => s.name.toLowerCase() === searchQuery.toLowerCase().trim()
            );
            if (matched) {
                navigate(`/services/${matched.pathName}`);
            } else {
                // If not exact match, route to serviceProvider with custom query
                navigate(`/services/servicePage?search=${encodeURIComponent(searchQuery)}`);
            }
        }
    };

    const handleSuggestionClick = (pathName) => {
        navigate(`/services/${pathName}`);
    };

    return (
        <div className="homepage_outer_container">
            {/* 1. Slight Animated Parallax Background Layer */}
            <div className="homepage_parallax_bg"></div>
            <div className="homepage_bg_overlay"></div>

            {/* 2. Main Scrollable Container */}
            <div className="homepage_scroll_container">
                
                {/* HERO SECTION */}
                <section className="homepage_hero_section" style={{ opacity: scrollOpacity }}>
                    <div className="hero_glass_container">
                        <span className="hero_badge"><FaBolt /> Instant Home Help</span>
                        <h1 className="hero_title">
                            Expert Local Help <br />
                            <span className="gradient_text">At Your Fingertips</span>
                        </h1>
                        <p className="hero_subtitle">
                            Local Seva connects you with top-rated, background-verified professionals in your neighborhood instantly. 100% Secure & Reliable.
                        </p>

                        {/* Interactive Search Bar */}
                        <form className="hero_search_form" onSubmit={handleSearchSubmit}>
                            <div className="search_input_wrapper">
                                <FaSearch className="search_icon" />
                                <input
                                    type="text"
                                    placeholder="Search e.g. Plumber, Maid, Electrician..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                />
                                <button type="submit" className="search_btn">Find Help</button>
                            </div>

                            {/* Dropdown Suggestions */}
                            {isFocused && searchQuery && filteredSuggestions.length > 0 && (
                                <ul className="search_suggestions_dropdown">
                                    {filteredSuggestions.map((suggestion) => (
                                        <li
                                            key={suggestion.id}
                                            onClick={() => handleSuggestionClick(suggestion.pathName)}
                                        >
                                            <span className="suggestion_name">{suggestion.name}</span>
                                            <span className="suggestion_desc">{suggestion.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </form>

                        {/* Popular Tags */}
                        <div className="hero_popular_tags">
                            <span className="tags_label">Popular:</span>
                            {["Plumber", "Maid", "Electrician", "Carpenter"].map((tagName) => {
                                const found = services.find((s) => s.name === tagName);
                                return (
                                    <button
                                        key={tagName}
                                        className="tag_pill"
                                        onClick={() => handleSuggestionClick(found ? found.pathName : tagName.toLowerCase())}
                                    >
                                        {tagName}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="hero_scroll_indicator">
                        <p>Scroll down to explore</p>
                        <FaArrowDown className="bounce_arrow" />
                    </div>
                </section>

                {/* TRUST BADGE SECTION */}
                <section className="homepage_trust_section">
                    <div className="trust_grid container">
                        <div className="trust_card">
                            <div className="trust_icon_wrapper"><FaShieldAlt /></div>
                            <h3>100% Background Verified</h3>
                            <p>Every single handyman is thoroughly background checked with verified Gov. Aadhar ID credentials.</p>
                        </div>
                        <div className="trust_card">
                            <div className="trust_icon_wrapper"><FaStar /></div>
                            <h3>4.9/5 Average Rating</h3>
                            <p>Rated by thousands of residents in the community for exceptional quality and promptness.</p>
                        </div>
                        <div className="trust_card">
                            <div className="trust_icon_wrapper"><FaLock /></div>
                            <h3>Secure Stripe Payments</h3>
                            <p>Your money is handled securely using top-tier encryption. Pay with full confidence.</p>
                        </div>
                    </div>
                </section>

                {/* SERVICES SECTION */}
                <section className="homepage_services_section">
                    <div className="services_glass_panel container">
                        <div className="section_header">
                            <h2>Our Specialized Services</h2>
                            <p>Choose from our verified expert categories. Book in under a minute.</p>
                        </div>

                        <div className="services_grid">
                            {services.map((service) => (
                                <div className="service_glass_card" key={service.id}>
                                    <div className="service_card_image">
                                        <img src={service.image} alt={service.name} />
                                    </div>
                                    <div className="service_card_content">
                                        <h3>{service.name}</h3>
                                        <p>{service.description}</p>
                                        <Link to={`/services/${service.pathName}`} className="service_card_link">
                                            <span>Book Service</span>
                                            <span className="arrow_icon">→</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="services_bottom_banner">
                            <div className="banner_text">
                                <h3>Get a hand for your every household need</h3>
                                <p>No job is too big or too small. Our professionals are equipped with industry-grade tools to handle your requirements perfectly.</p>
                            </div>
                            <div className="banner_image">
                                <img src={services_bottom} alt="Team" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ONE CLICK SOLUTIONS SECTION */}
                <section className="homepage_oneclick_section">
                    <div className="oneclick_glass_panel container">
                        <div className="section_header light">
                            <h2>One Click Can Solve Your Problem</h2>
                            <p>We've engineered the fastest booking-to-arrival flow to ensure instant resolution.</p>
                        </div>

                        <div className="oneclick_cards_grid">
                            {/* Card 1 */}
                            <div className="oneclick_card gradient_amber">
                                <div className="card_step">01</div>
                                <h3>Select Your Service</h3>
                                <p>Choose from our specialized local categories tailored precisely to your budget and needs.</p>
                                <div className="oneclick_image_box">
                                    <img src={oneclick_1} alt="Select" />
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="oneclick_card gradient_blue">
                                <div className="card_step">02</div>
                                <h3>Connect Instantly</h3>
                                <p>Our geolocation router automatically alerts the nearest online verified handymen in your area.</p>
                                <div className="oneclick_image_box">
                                    <img src={oneclick_2} alt="Connect" />
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="oneclick_card gradient_rose">
                                <div className="card_step">03</div>
                                <h3>Verified via OTP</h3>
                                <p>Start your service securely with a 4-digit start OTP sent directly to your registered email.</p>
                                <div className="oneclick_image_box">
                                    <img src={oneclick_3} alt="Verify" />
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="oneclick_card gradient_bronze">
                                <div className="card_step">04</div>
                                <h3>Secure Stripe Checkout</h3>
                                <p>Pay safely with a seamless checkout experience. Transparent base and platform fees.</p>
                                <div className="oneclick_image_box">
                                    <img src={oneclick_4} alt="Pay" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* JOIN OUR TEAM SECTION */}
                <section className="homepage_join_section">
                    <div className="join_glass_card container">
                        <div className="join_card_content">
                            <span className="join_badge"><FaUserTie /> Become a Partner</span>
                            <h2>Want to join our helping team?</h2>
                            <p>
                                Are you a skilled electrician, plumber, carpenter, or cleaning professional? Register with Local Seva to get steady jobs near you, set your own working hours, and receive secure, instant digital payouts.
                            </p>
                            
                            <ul className="join_benefits_list">
                                <li><FaCheckCircle /> Instant access to local customers</li>
                                <li><FaCheckCircle /> Set your own rates & work schedule</li>
                                <li><FaCheckCircle /> Weekly guaranteed Stripe payouts</li>
                                <li><FaCheckCircle /> Premium platform protection & support</li>
                            </ul>

                            <div className="join_actions">
                                <Link to="/handyman/register" className="primary_join_btn">
                                    Register as Professional
                                </Link>
                                <Link to="/handyman/login" className="secondary_join_btn">
                                    Handyman Portal Login
                                </Link>
                            </div>
                        </div>
                        <div className="join_card_image">
                            <img src={joinourteam} alt="Professional Team" />
                        </div>
                    </div>
                </section>

                {/* HAPPINESS GUARANTEE BADGE */}
                <section className="homepage_guarantee_section">
                    <div className="guarantee_glass_panel container">
                        <div className="guarantee_badge_wrapper">
                            <FaAward className="gold_award" />
                        </div>
                        <h2>The Local Seva Happiness Guarantee</h2>
                        <p>
                            Your peace of mind is our absolute priority. If you are not entirely satisfied with the quality of the service provided, we will work relentlessly with our certified partners to make it right—completely free of charge. That is our unwavering commitment to you.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default Homepage;
