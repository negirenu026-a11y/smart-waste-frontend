import React, { useState } from 'react';

const Blog = () => {
    const [expandedPost, setExpandedPost] = useState(null);

    const posts = [
        {
            id: 1,
            title: "Impact of Climate Change",
            excerpt: "Understanding the devastating effects of rising temperatures on our forest ecosystems and global climate stability.",
            fullContent: "The increasing frequency of forest fires and extreme weather events is a direct result of global warming. Our latest study shows how these changes are disrupting local biodiversity and what we can do to mitigate the damage through smarter waste management and emission reduction.",
            date: "May 12, 2026",
            image: "/img/blog-1.jpg"
        },
        {
            id: 2,
            title: "The Future of Green Power",
            excerpt: "How renewable energy sources like wind and solar are transforming our urban landscape and reducing carbon footprints.",
            fullContent: "Transitioning to renewable energy is no longer an option but a necessity. Wind turbines and solar panels are becoming integral parts of smart cities, providing clean energy while reducing our reliance on fossil fuels. Our projects focus on integrating these technologies into waste-to-energy plants.",
            date: "June 5, 2026",
            image: "/img/blog-2.jpg"
        },
        {
            id: 3,
            title: "Protecting Our Water Resources",
            excerpt: "Exploring the beauty and importance of natural water bodies and the urgent need to keep them free from pollution.",
            fullContent: "Waterfalls and rivers are the lifeblood of our environment. However, they are increasingly threatened by industrial waste and plastic pollution. We are implementing advanced filtration and waste tracking systems to ensure our natural wonders remain pristine for generations to come.",
            date: "July 20, 2026",
            image: "/img/blog-3.jpg"
        },
        {
            id: 4,
            title: "Biodiversity in the Heartland",
            excerpt: "The vital role of dense forests in maintaining ecological balance and supporting diverse life forms.",
            fullContent: "Forests are more than just trees; they are complex ecosystems that support millions of species. By managing urban waste effectively, we prevent harmful chemicals from leaching into forest soils, protecting the delicate balance of nature and ensuring a healthy planet for all.",
            date: "August 15, 2026",
            image: "/img/blog-4.jpg"
        },
        {
            id: 5,
            title: "Restoring Scorched Earth",
            excerpt: "Innovative techniques for reforestation and habitat recovery in areas affected by wildfires and industrial activity.",
            fullContent: "Recovery after a fire or industrial spill is a slow process, but with the right soil management and waste removal strategies, we can bring life back to scorched lands. Our team is pioneering new methods of soil enrichment using recycled organic waste to speed up reforestation.",
            date: "September 10, 2026",
            image: "/img/causes-4.jpg"
        },
        {
            id: 6,
            title: "The Wind Energy Revolution",
            excerpt: "A deep dive into how modern wind farm technology is becoming more efficient and community-friendly.",
            fullContent: "Modern wind turbines are quieter and more efficient than ever. They represent a significant step towards community-driven power generation. We are working with local municipalities to install small-scale turbines that power local waste collection and sorting facilities.",
            date: "October 5, 2026",
            image: "/img/events-1.jpg"
        }
    ];

    return (
        <div className="container-fluid blog py-5">
            <div className="container pb-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
                    <h5 className="fw-bold text-primary text-uppercase">Our Blog</h5>
                    <h1 className="display-5 mb-0">Latest Stories & News</h1>
                </div>
                <div className="row g-4">
                    {posts.map(post => (
                        <div className="col-lg-4 col-md-6" key={post.id}>
                            <div className="blog-item bg-light rounded overflow-hidden shadow-sm h-100">
                                <div className="blog-img">
                                    <img src={post.image} className="img-fluid w-100" alt={post.title} style={{ height: '250px', objectFit: 'cover' }} />
                                </div>
                                <div className="blog-content p-4">
                                    <div className="d-flex mb-3 small text-muted">
                                        <i className="fa fa-calendar-alt text-primary me-2"></i>
                                        <span>{post.date}</span>
                                    </div>
                                    <h4 className="mb-3">{post.title}</h4>
                                    <p className="text-secondary small mb-4">
                                        {expandedPost === post.id ? post.fullContent : post.excerpt}
                                    </p>
                                    <button 
                                        className="btn btn-outline-primary rounded-pill px-4" 
                                        onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                                    >
                                        {expandedPost === post.id ? "Read Less" : "Read More"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
