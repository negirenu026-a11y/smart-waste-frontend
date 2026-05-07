import React, { useState } from 'react';
import { toast } from 'react-toastify';

const VolunteerForm = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Thank you for applying! We will get back to you soon.');
    };

    return (
        <div className="container-fluid py-5 bg-light">
            <div className="container pb-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Join Us</h5>
                    <h1 className="display-5 mb-0">Volunteer Application Form</h1>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        <div className="bg-white rounded-4 shadow-sm p-5">
                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="text" className="form-control border-0 bg-light" id="name" placeholder="Your Name" required />
                                            <label htmlFor="name">Your Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input type="email" className="form-control border-0 bg-light" id="email" placeholder="Your Email" required />
                                            <label htmlFor="email">Your Email</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input type="text" className="form-control border-0 bg-light" id="phone" placeholder="Phone Number" required />
                                            <label htmlFor="phone">Phone Number</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea className="form-control border-0 bg-light" placeholder="Leave a message here" id="message" style={{ height: '150px' }} required></textarea>
                                            <label htmlFor="message">Message</label>
                                        </div>
                                    </div>
                                    <div className="col-12 text-center">
                                        <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" type="submit">Submit Application</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerForm;
