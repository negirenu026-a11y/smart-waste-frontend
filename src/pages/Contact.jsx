import React from 'react';

const Contact = () => {
    return (
        <div className="container-fluid contact py-5">
            <div className="container pb-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Contact Us</h5>
                    <h1 className="display-5 mb-0">Get In Touch For Any Query</h1>
                </div>
                <div className="row g-5">
                    <div className="col-lg-6">
                        <h3 className="fw-bold mb-4">Send a Message</h3>
                        <form className="row g-3">
                            <div className="col-md-6">
                                <input type="text" className="form-control border-0 bg-light px-4" placeholder="Your Name" style={{ height: '55px' }} />
                            </div>
                            <div className="col-md-6">
                                <input type="email" className="form-control border-0 bg-light px-4" placeholder="Your Email" style={{ height: '55px' }} />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control border-0 bg-light px-4" placeholder="Your Phone" style={{ height: '55px' }} />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control border-0 bg-light px-4" placeholder="Subject" style={{ height: '55px' }} />
                            </div>
                            <div className="col-12">
                                <textarea className="form-control border-0 bg-light px-4 py-3" rows="5" placeholder="Message"></textarea>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold" type="submit">Send Message</button>
                            </div>
                        </form>
                    </div>
                    <div className="col-lg-6">
                        <div className="d-flex align-items-center mb-4">
                            <div className="btn-lg-square bg-primary text-white rounded-circle me-3">
                                <i className="fa fa-map-marker-alt"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Our Office</h5>
                                <p className="mb-0 text-secondary">Sector 74, Phase 8B, Mohali, Punjab, India</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <div className="btn-lg-square bg-primary text-white rounded-circle me-3">
                                <i className="fa fa-envelope"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Email Us</h5>
                                <p className="mb-0 text-secondary">negirenu026@gmail.com</p>
                            </div>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <div className="btn-lg-square bg-primary text-white rounded-circle me-3">
                                <i className="fa fa-phone"></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-1">Call Us</h5>
                                <p className="mb-0 text-secondary">+91 86289-71014</p>
                            </div>
                        </div>
                        <div className="rounded overflow-hidden" style={{ height: '300px' }}>
                            <iframe 
                                className="w-100 h-100"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.138258284534!2d76.6890333!3d30.7145789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fef93e0b749eb%3A0xc39f88636a008c23!2sSector%2074%2C%20Sahibzada%20Ajit%20Singh%20Nagar%2C%20Punjab!5e0!3m2!1sen!2sin!4v1714220000000!5m2!1sen!2sin" 
                                frameBorder="0" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                aria-hidden="false" 
                                tabIndex="0"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
