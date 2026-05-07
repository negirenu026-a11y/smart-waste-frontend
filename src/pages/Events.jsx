import React from 'react';

const Events = () => {
    const events = [
        {
            id: 1,
            title: "Clean City Drive",
            date: "May 20, 2026",
            location: "City Square Park",
            image: "/img/events-1.jpg",
            description: "Join us for a massive city-wide cleaning event to beautify our streets and parks."
        },
        {
            id: 2,
            title: "Recycling Workshop",
            date: "June 15, 2026",
            location: "Community Center",
            image: "/img/events-2.jpg",
            description: "Learn effective recycling techniques and how to segregate waste at home."
        },
        {
            id: 3,
            title: "Awareness Campaign",
            date: "July 10, 2026",
            location: "Main Street Plaza",
            image: "/img/events-3.jpg",
            description: "A public awareness event focused on reducing plastic use and environmental care."
        }
    ];

    return (
        <div className="container-fluid event py-5">
            <div className="container pb-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Our Events</h5>
                    <h1 className="display-5 mb-0">Upcoming Environmental Events</h1>
                </div>
                <div className="row g-4">
                    {events.map((event) => (
                        <div className="col-lg-4" key={event.id}>
                            <div className="event-item bg-light rounded shadow-sm overflow-hidden h-100">
                                <div className="event-img position-relative">
                                    <img src={event.image} className="img-fluid w-100" alt={event.title} />
                                    <div className="event-date bg-primary text-white text-center p-2 position-absolute top-0 start-0 m-3 rounded">
                                        <h6 className="mb-0">{event.date.split(' ')[0]}</h6>
                                        <small>{event.date.split(' ')[1]}</small>
                                    </div>
                                </div>
                                <div className="event-content p-4">
                                    <div className="d-flex mb-3 small text-muted">
                                        <div className="me-3">
                                            <i className="fa fa-map-marker-alt text-primary me-2"></i>
                                            <span>{event.location}</span>
                                        </div>
                                        <div>
                                            <i className="fa fa-clock text-primary me-2"></i>
                                            <span>10:00 AM</span>
                                        </div>
                                    </div>
                                    <h4 className="mb-3">{event.title}</h4>
                                    <p className="mb-4 text-secondary">{event.description}</p>
                                    <a className="btn btn-outline-primary rounded-pill px-4" href="#">Read More</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Events;
