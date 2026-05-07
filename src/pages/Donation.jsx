import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Donation = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const donationCards = [
        {
            id: 1,
            title: "Nature Restoration",
            subtitle: "Help us plant more trees and restore habitats.",
            category: "Ecosystem",
            image: "/img/donation-1.jpg"
        },
        {
            id: 2,
            title: "Mountain Cleanup",
            subtitle: "Removing plastic waste from high-altitude areas.",
            category: "Waste Free",
            image: "/img/donation-3.jpg"
        },
        {
            id: 3,
            title: "Save Our Oceans",
            subtitle: "Protecting marine life from plastic pollution.",
            category: "Marine Life",
            image: "/img/service-2.jpg"
        }
    ];

    const handleDonateClick = (category) => {
        setSelectedCategory(category);
        setShowModal(true);
    };

    return (
        <div className="container-fluid donation py-5">
            <div className="container pb-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Make A Donation</h5>
                    <h1 className="display-5 mb-0">Your Support Matters For Our Mission</h1>
                </div>
                <div className="row g-4">
                    {donationCards.map(card => (
                        <div className="col-lg-4" key={card.id}>
                            <div className="donation-item position-relative rounded overflow-hidden shadow-sm h-100">
                                <img src={card.image} className="img-fluid w-100" alt={card.category} style={{ height: '400px', objectFit: 'cover' }} />
                                <div className="donation-content position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4 text-center" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
                                    <h6 className="text-white text-uppercase mb-2">{card.category}</h6>
                                    <h3 className="text-white mb-2">{card.title}</h3>
                                    <p className="text-white-50 mb-4">{card.subtitle}</p>
                                    <button 
                                        className="btn btn-primary rounded-pill py-2 px-4 fw-bold shadow-sm" 
                                        onClick={() => handleDonateClick(card.category)}
                                    >
                                        Donate Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Donation Modal */}
            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content rounded-4 border-0 shadow-lg">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold text-primary">Donate to {selectedCategory}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Full Name</label>
                                        <input type="text" className="form-control border-0 bg-light px-3 py-2" placeholder="Your Name" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Email Address</label>
                                        <input type="email" className="form-control border-0 bg-light px-3 py-2" placeholder="Your Email" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Amount ($)</label>
                                        <input type="number" className="form-control border-0 bg-light px-3 py-2" placeholder="Donation Amount" />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold">Message</label>
                                        <textarea className="form-control border-0 bg-light px-3 py-2" rows="3" placeholder="Leave a message"></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm mt-3" onClick={(e) => { e.preventDefault(); toast.success('Thank you for your donation!'); setShowModal(false); }}>
                                        Confirm Donation
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Donation;
