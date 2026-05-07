import React, { useState } from 'react';

const About = () => {
    const [activeTab, setActiveTab] = useState('about');

    return (
        <div className="container-fluid about py-5">
            <div className="container pb-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <div className="about-img">
                            <img src="/img/about-1.jpg" className="img-fluid w-100 rounded" alt="About" />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="section-header text-start">
                            <h5 className="fw-bold text-primary text-uppercase">About Us</h5>
                            <h1 className="display-4 mb-4">Our Mission: ECO NOT EGO</h1>
                        </div>
                        <p className="mb-4">
                            We are committed to enhancing waste management awareness and building a smart city vision. 
                            Our goal is to create a sustainable future through innovative technology and community participation.
                        </p>
                        
                        <div className="about-tabs">
                            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'about' ? 'active' : ''}`} 
                                        onClick={() => setActiveTab('about')}
                                    >About</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'mission' ? 'active' : ''}`} 
                                        onClick={() => setActiveTab('mission')}
                                    >Mission</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button 
                                        className={`nav-link ${activeTab === 'vision' ? 'active' : ''}`} 
                                        onClick={() => setActiveTab('vision')}
                                    >Vision</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                {activeTab === 'about' && (
                                    <div className="tab-pane fade show active">
                                        <p className="mb-0">We are a leading organization dedicated to environmental conservation and waste management. Our team works tirelessly to implement smart solutions for a cleaner tomorrow.</p>
                                    </div>
                                )}
                                {activeTab === 'mission' && (
                                    <div className="tab-pane fade show active">
                                        <p className="mb-0">Our mission is to reduce environmental impact through efficient waste collection and recycling programs, while educating the public on sustainable living practices.</p>
                                    </div>
                                )}
                                {activeTab === 'vision' && (
                                    <div className="tab-pane fade show active">
                                        <p className="mb-0">We envision a world where cities are smart, green, and waste-free. A future where technology and nature coexist in perfect harmony for the benefit of all citizens.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="row g-4 mt-4">
                            <div className="col-sm-6">
                                <div className="d-flex">
                                    <i className="fa fa-check text-primary me-3"></i>
                                    <p className="mb-0">Smart Waste Tracking</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex">
                                    <i className="fa fa-check text-primary me-3"></i>
                                    <p className="mb-0">Eco-friendly Recycling</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex">
                                    <i className="fa fa-check text-primary me-3"></i>
                                    <p className="mb-0">Community Awareness</p>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex">
                                    <i className="fa fa-check text-primary me-3"></i>
                                    <p className="mb-0">Sustainable Vision</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
