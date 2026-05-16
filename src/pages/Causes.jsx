import React from 'react';
import { Link } from 'react-router-dom';
import './causes.css';

const Causes = () => {
    const causes = [
        {
            id: 1,
            title: "Air Quality Monitoring",
            description: "Campaigning for cleaner air and reduction of harmful industrial emissions in our urban centers.",
            goal: "₹5000",
            raised: "₹3200",
            image: "/img/causes-1.jpg",
            progress: 64
        },
        {
            id: 2,
            title: "Environmental Education",
            description: "Empowering the next generation with knowledge about zero-waste living and sustainability.",
            goal: "₹5000",
            raised: "₹3200",
            image: "/img/causes-2.jpg",
            progress: 64
        },
        {
            id: 3,
            title: "Community Advocacy",
            description: "Supporting citizen-led movements to demand better environmental policies and services.",
            goal: "₹5000",
            raised: "₹3200",
            image: "/img/causes-3.jpg",
            progress: 64
        },
        {
            id: 4,
            title: "Nature Restoration",
            description: "Joining hands to plant trees and restore local habitats for a greener future.",
            goal: "₹5000",
            raised: "₹3200",
            image: "/img/donation-1.jpg",
            progress: 64
        }
    ];

    return (
        <div className="container-fluid causes py-5">
            <div className="container pb-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Our Causes</h5>
                    <h1 className="display-5 mb-0">Support Our Environmental Initiatives</h1>
                </div>
                <div className="row g-4">
                    {causes.map((cause) => (
                        <div className="col-lg-6 col-xl-3" key={cause.id}>
                            <div className="causes-item bg-light rounded overflow-hidden shadow-sm h-100">
                                <div className="causes-img">
                                    <img src={cause.image} className="img-fluid w-100" alt={cause.title} />
                                </div>
                                <div className="causes-content p-4">
                                    <h5 className="mb-3">{cause.title}</h5>
                                    <p className="text-secondary small mb-4">{cause.description}</p>
                                    <div className="progress rounded-pill mb-2" style={{ height: '10px' }}>
                                        <div
                                            className="progress-bar bg-primary"
                                            role="progressbar"
                                            style={{ width: `${cause.progress}%` }}
                                            aria-valuenow={cause.progress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                    <div className="d-flex justify-content-between small fw-bold">
                                        <span>Goal: {cause.goal}</span>
                                        <span>Raised: {cause.raised}</span>
                                    </div>
                                </div>
                                <div className="causes-btn p-4 pt-0">
                                    <Link to="/donation" className="btn btn-outline-primary w-100 rounded-pill px-4">Support Now</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Causes;
