import React from 'react';
import { Link } from 'react-router-dom';

const Volunteer = () => {
    const volunteers = [
        {
            id: 1,
            name: "Michel Brown",
            role: "Communicator",
            image: "/img/volunteers-1.jpg"
        },
        {
            id: 2,
            name: "Sarah Jenkins",
            role: "Coordinator",
            image: "/img/volunteers-2.jpg"
        },
        {
            id: 3,
            name: "David Smith",
            role: "Manager",
            image: "/img/volunteers-3.jpg"
        },
        {
            id: 4,
            name: "James Wilson",
            role: "Team Lead",
            image: "/img/volunteers-4.jpg"
        }
    ];

    return (
        <div className="container-fluid volunteer py-5">
            <div className="container pb-5">
                {/* Top Section with 2x2 grid of persons */}
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6">
                        <div className="row g-4">
                            {volunteers.map(volunteer => (
                                <div className="col-6" key={volunteer.id}>
                                    <div className="volunteer-item bg-light rounded overflow-hidden shadow-sm h-100">
                                        <div className="volunteer-img">
                                            <img src={volunteer.image} className="img-fluid w-100" alt={volunteer.name} style={{ height: '220px', objectFit: 'cover' }} />
                                        </div>
                                        <div className="volunteer-content text-center p-3">
                                            <h5 className="mb-1">{volunteer.name}</h5>
                                            <p className="text-primary small mb-0">{volunteer.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <h5 className="fw-bold text-primary text-uppercase">Become A Volunteer</h5>
                        <h1 className="display-5 mb-4">Join your hand with us for a better life and beautiful future.</h1>
                        <p className="mb-4 text-secondary">
                            We are looking for passionate individuals to join our mission. Whether you have experience in environmental science, communication, or just a desire to help, we have a place for you. Join our global community and make a direct impact on the environment.
                        </p>
                        <div className="row g-4 mb-4">
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center">
                                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3">
                                        <i className="fa fa-check"></i>
                                    </div>
                                    <span>Direct Environmental Impact</span>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center">
                                    <div className="btn-sm-square bg-primary text-white rounded-circle me-3">
                                        <i className="fa fa-check"></i>
                                    </div>
                                    <span>Community Empowerment</span>
                                </div>
                            </div>
                        </div>
                        <Link className="btn btn-primary rounded-pill py-3 px-5 fw-bold shadow-sm" to="/volunteer-form">Apply Now</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Volunteer;
