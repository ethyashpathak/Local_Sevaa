import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ServicePerson from "./ServicePerson";
import "./ServiceProvider.css";
import { FaWrench, FaBolt, FaBroom, FaPaintRoller } from "react-icons/fa";

const CATEGORIES = [
    { id: "plumber", label: "Plumbing", icon: <FaWrench /> },
    { id: "electrician", label: "Electrical", icon: <FaBolt /> },
    { id: "maid", label: "Cleaning", icon: <FaBroom /> },
    { id: "painter", label: "Painting", icon: <FaPaintRoller /> }
];

function ServiceProvider() {
    const location = useLocation();
    const urlCategory = new URLSearchParams(location.search).get("service");
    
    const [activeCategory, setActiveCategory] = useState(urlCategory || "plumber");
    const [handymen, setHandymen] = useState([]);
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);

    const [viewState, setViewState] = useState({
        longitude: 77.209, // default to Delhi
        latitude: 28.6139,
        zoom: 12
    });

    useEffect(() => {
        const fetchHandymen = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_API}/api/handyman/getallhandyman`);
                const data = await response.json();
                setHandymen(data);
            } catch (error) {
                console.error("Failed to fetch handymen", error);
            }
        };

        fetchHandymen();
    }, []);

    useEffect(() => {
        const userLat = parseFloat(new URLSearchParams(location.search).get("lat"));
        const userLong = parseFloat(new URLSearchParams(location.search).get("long"));
        
        if (userLat && userLong) {
            setLat(userLat);
            setLong(userLong);
            setViewState(prev => ({
                ...prev,
                longitude: userLong,
                latitude: userLat,
                zoom: 12
            }));
        }
    }, [location.search]);

    function calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
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
    }

    const sortedHandymen = useMemo(() => {
        const filtered = handymen.filter(
            (h) => h.services?.toLowerCase() === activeCategory.toLowerCase()
        );

        return filtered.sort((a, b) => {
            const distanceA = calculateDistance(lat, long, a.lat, a.long);
            const distanceB = calculateDistance(lat, long, b.lat, b.long);
            return distanceA - distanceB;
        });
    }, [handymen, activeCategory, lat, long]);

    const getCategoryIcon = (catId) => {
        const cat = CATEGORIES.find(c => c.id === catId);
        return cat ? cat.icon : <FaWrench />;
    };

    return (
        <div className="serviceProvider_layout">
            <div className="serviceProvider_left">
                <div className="serviceProvider_header">
                    <h1>Find near you</h1>
                    
                    <div className="category_pills">
                        {CATEGORIES.map(cat => (
                            <div 
                                key={cat.id} 
                                className={`category_pill ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.icon}
                                <span>{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="service_list">
                    {sortedHandymen.map((provider) => {
                        const distance = calculateDistance(lat, long, provider.lat, provider.long);
                        return (
                            <ServicePerson
                                key={provider.handyman_id}
                                distance={distance}
                                category={activeCategory}
                                {...provider}
                            />
                        );
                    })}
                    {sortedHandymen.length === 0 && (
                        <p style={{color: '#64748b', marginTop: '20px'}}>No professionals found for this category near you.</p>
                    )}
                </div>
            </div>
            <div className="serviceProvider_right">
                {process.env.REACT_APP_MAPBOX_ACCESS_TOKEN ? (
                    <Map
                        {...viewState}
                        onMove={evt => setViewState(evt.viewState)}
                        mapStyle="mapbox://styles/mapbox/light-v11"
                        mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                    >
                        {/* User Location Pin */}
                        {lat && long && (
                            <Marker longitude={long} latitude={lat} anchor="bottom">
                                <div style={{width: '15px', height: '15px', backgroundColor: '#ef4444', borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.3)'}}></div>
                            </Marker>
                        )}
                        
                        {/* Handymen Pins */}
                        {sortedHandymen.map((provider) => (
                            <Marker 
                                key={provider.handyman_id} 
                                longitude={parseFloat(provider.long)} 
                                latitude={parseFloat(provider.lat)} 
                                anchor="bottom"
                            >
                                <div className="map_marker">
                                    {getCategoryIcon(activeCategory)}
                                </div>
                            </Marker>
                        ))}
                    </Map>
                ) : (
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: '#e2e8f0', color: '#64748b'}}>
                        Mapbox Token Missing
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceProvider;
