import React, { useState } from 'react';
import './services.css';

const Services = () => {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            id: 1,
            title: "Organic Waste Recycling",
            description: "Turning organic waste into nutrient-rich compost for urban farming and green spaces.",
            fullDetails: "Our organic waste program focuses on collecting food scraps and green waste from residential and commercial areas. This waste is processed in high-tech composting facilities to create premium-grade fertilizers, reducing landfill methane emissions by 60%.",
            benefits: ["Reduction in landfill waste", "Natural fertilizer production", "Lower carbon footprint"],
            image: "/img/service-1.jpg"
        },
        {
            id: 2,
            title: "Marine Waste Control",
            description: "Implementing smart systems to stop plastic waste from reaching our precious oceans.",
            fullDetails: "We deploy specialized barrier systems and automated clean-up drones in rivers and coastal outlets. By intercepting plastic before it enters the deep sea, we protect thousands of marine species and maintain the integrity of our oceanic food chains.",
            benefits: ["Microplastic reduction", "Coral reef protection", "Cleaner beaches"],
            image: "/img/service-2.jpg"
        },
        {
            id: 3,
            title: "Sustainable Disposal",
            description: "Moving beyond traditional landfills towards advanced 100% waste-to-energy solutions.",
            fullDetails: "Our state-of-the-art incineration and anaerobic digestion plants convert non-recyclable waste into electricity and heat. This circular approach provides clean energy to local grids while eliminating the need for vast landfill spaces.",
            benefits: ["Clean energy generation", "No groundwater contamination", "Space efficiency"],
            image: "/img/service-3.jpg"
        },
        {
            id: 4,
            title: "Ecosystem Preservation",
            description: "Ensuring waste management practices protect local wildlife and essential pollinators.",
            fullDetails: "We integrate biodiversity corridors into our waste facility designs. Our 'Bee-Friendly' zones and reforested buffer areas ensure that industrial activities do not disrupt local flora and fauna, supporting a balanced local ecosystem.",
            benefits: ["Wildlife habitat restoration", "Pollinator support", "Air quality improvement"],
            image: "/img/service-4.jpg"
        }
    ];

    return (
        <div className="container-fluid service py-5">
            <div className="container pb-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Our Services</h5>
                    <h1 className="display-5 mb-0">Smart Waste Management Solutions</h1>
                </div>
                <div className="row g-4">
                    {services.map((service) => (
                        <div className="col-md-6 col-lg-3" key={service.id}>
                            <div 
                                className="service-item bg-light rounded h-100 shadow-sm overflow-hidden" 
                                style={{ cursor: 'pointer', transition: 'transform 0.3s' }}
                                onClick={() => setSelectedService(service)}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div className="service-img position-relative">
                                    <img src={service.image} className="img-fluid w-100" alt={service.title} />
                                    <div className="position-absolute top-50 start-50 translate-middle text-white opacity-0 hover-opacity-100 transition">
                                        <i className="fas fa-search-plus fa-3x"></i>
                                    </div>
                                </div>
                                <div className="service-content text-center p-4">
                                    <h5 className="mb-3">{service.title}</h5>
                                    <p className="mb-0 text-muted small">{service.description}</p>
                                    <button className="btn btn-sm btn-outline-primary mt-3 px-3 rounded-pill">View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Detail Modal */}
            {selectedService && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg animate__animated animate__zoomIn">
                        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-lg">
                            <div className="row g-0">
                                <div className="col-md-5">
                                    <img src={selectedService.image} className="img-fluid h-100 w-100" style={{ objectFit: 'cover' }} alt={selectedService.title} />
                                </div>
                                <div className="col-md-7">
                                    <div className="modal-header border-0 pb-0 pe-4 pt-4">
                                        <h4 className="modal-title fw-bold text-primary">{selectedService.title}</h4>
                                        <button type="button" className="btn-close" onClick={() => setSelectedService(null)}></button>
                                    </div>
                                    <div className="modal-body p-4">
                                        <p className="lead fs-6 text-muted mb-4">{selectedService.fullDetails}</p>
                                        
                                        <h6 className="fw-bold mb-3"><i className="fas fa-check-circle text-success me-2"></i> Key Benefits:</h6>
                                        <ul className="list-unstyled">
                                            {selectedService.benefits.map((benefit, i) => (
                                                <li key={i} className="mb-2 d-flex align-items-center">
                                                    <span className="badge bg-success bg-opacity-10 text-success me-2">•</span>
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="modal-footer border-0 p-4 pt-0">
                                        <button type="button" className="btn btn-primary px-4 rounded-pill" onClick={() => setSelectedService(null)}>Got it, thanks!</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
