import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { handleImageError } from '../utils/imageFallback.js'
import CityDataDisplay from '../components/CityDataDisplay';

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [statsCount, setStatsCount] = useState({ projects: 0, volunteers: 0, people: 0, awards: 0 })
  const [statsStarted, setStatsStarted] = useState(false)
  const statsRef = useRef(null)

  const services = [
    {
      title: 'Organic Waste Recycling',
      description: 'Turning organic waste into nutrient-rich compost for urban farming and green spaces.',
      icon: 'bi-flower1',
      image: '/img/service-1.jpg'
    },
    {
      title: 'Marine Waste Control',
      description: 'Implementing smart systems to stop plastic waste from reaching our precious oceans.',
      icon: 'bi-droplet',
      image: '/img/service-2.jpg'
    },
    {
      title: 'Sustainable Disposal',
      description: 'Moving beyond traditional landfills towards advanced 100% waste-to-energy solutions.',
      icon: 'bi-recycle',
      image: '/img/service-3.jpg'
    },
    {
      title: 'Ecosystem Preservation',
      description: 'Ensuring waste management practices protect local wildlife and essential pollinators.',
      icon: 'bi-bug',
      image: '/img/service-4.jpg'
    },
  ]

  const serviceImages = [
    '/img/service-1.jpg',
    '/img/service-2.jpg',
    '/img/service-3.jpg',
    '/img/service-4.jpg',
  ]

  const causes = [
    {
      title: 'Air Quality Monitoring',
      text: 'Campaigning for cleaner air and reduction of harmful industrial emissions in our urban centers.',
      image: '/img/causes-1.jpg',
    },
    {
      title: 'Environmental Education',
      text: 'Empowering the next generation with knowledge about zero-waste living and sustainability.',
      image: '/img/causes-2.jpg',
    },
    {
      title: 'Community Advocacy',
      text: 'Supporting citizen-led movements to demand better environmental policies and waste services.',
      image: '/img/causes-3.jpg',
    },
  ]

  const galleryImages = [
    { src: '/img/gallery-1.jpg', title: 'Community Cleanup' },
    { src: '/img/gallery-2.jpg', title: 'Plastic Recycling' },
    { src: '/img/gallery-3.jpg', title: 'Green City Vision' },
    { src: '/img/gallery-4.jpg', title: 'Smart Monitoring' },
  ]

  const heroSlides = [
    {
      image: '/img/carousel-1.jpg',
      title: 'Smart Waste Management',
      subtitle: 'Cleaner Cities, Brighter Future',
      description: 'Join our mission to restore ecosystems, support communities, and inspire change with practical waste management programs.'
    },
    {
      image: '/img/carousel-2.jpg',
      title: 'Efficient Recycling',
      subtitle: 'Zero Waste Vision',
      description: 'Transforming waste into resources through advanced segregation and recycling technology.'
    },
    {
      image: '/img/carousel-3.jpg',
      title: 'Public Awareness',
      subtitle: 'Join the Movement',
      description: 'Empowering citizens to take responsibility for their environment through education and action.'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, { threshold: 0.1 });
    
    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let animationFrameId;
    let timeoutId;

    const startLoop = () => {
      const duration = 2000;
      const startTime = performance.now();
      
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        
        setStatsCount({
          projects: Math.floor(120 * ease),
          volunteers: Math.floor(24 * ease),
          people: Math.floor(35 * ease),
          awards: Math.floor(8 * ease),
        });

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          timeoutId = setTimeout(startLoop, 3000); // 3s pause before next loop
        }
      };
      animationFrameId = requestAnimationFrame(animate);
    };

    startLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible]);

  return (
    <>
      <style>{`
        .gallery-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .gallery-img {
          transition: transform 0.5s ease;
          width: 100%;
          height: 250px;
          object-fit: cover;
        }
        .gallery-item:hover .gallery-img {
          transform: scale(1.15);
        }
        .gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(31, 92, 65, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        /* Horizontal Continuous Scrolling Styles */
        .scrolling-wrapper {
  overflow: hidden;
  width: 100%;
  position: relative;
  padding: 40px 0;
}

.scrolling-content {
  display: flex;
  width: max-content;
  animation: scrollCards 25s linear infinite;
}

.scrolling-content:hover {
  animation-play-state: paused;
}

.scrolling-card {
  width: 320px;
  flex-shrink: 0;
  padding: 0 15px;
}

.scrolling-card .card {
  transition: transform 0.3s ease;
}

.scrolling-card .card:hover {
  transform: translateY(-10px);
}

@keyframes scrollCards {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
      `}</style>

      {/* Hero Carousel Section - Fixed Header spacing is handled by MainLayout's .page-main class */}
      <section className="hero-section position-relative text-white overflow-hidden" style={{ height: '90vh' }}>
        <div className="carousel-container position-relative h-100">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className="carousel-slide position-absolute w-100 h-100"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: currentSlide === index ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: currentSlide === index ? 1 : 0,
              }}
            >
              <div className="carousel-overlay position-absolute w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}></div>
              <div className="carousel-content d-flex align-items-center h-100 position-relative" style={{ zIndex: 2 }}>
                <div className="container">
                  <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
                      <span className="eyebrow d-block mb-3 text-warning">{slide.subtitle}</span>
                      <h1 className="display-4 fw-bold mb-3">{slide.title}</h1>
                      <p className="lead text-white-75 mb-4">{slide.description}</p>
                      <div className="d-flex flex-wrap gap-3 justify-content-center">
                        <Link className="btn btn-warning btn-lg text-dark" to="/about">Learn More</Link>
                        <Link className="btn btn-outline-light btn-lg" to="/contact">Contact Us</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section with Continuous Horizontal Slider */}
      {/* Services Section with Combined Scrolling Cards */}
      <section className="section bg-light py-5">
        <div className="container py-5">
          <div className="section-heading text-center mb-5">
            <span className="eyebrow text-brand">What we do</span>
            <h2 className="fw-bold">How we protect environment</h2>
          </div>

          <div className="scrolling-wrapper">
            <div className="scrolling-content">
              {[...services, ...services].map((service, index) => (
                <div className="scrolling-card" key={index}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">

                    {/* Image */}
                    <img
                      src={service.image}
                      alt={service.title}
                      className="card-img-top"
                      style={{
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />

                    {/* Content */}
                    <div className="card-body text-center p-4">
                      <div
                        className="icon-box rounded-circle mx-auto mb-3 bg-primary text-white"
                        style={{
                          width: '60px',
                          height: '60px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i className={`bi ${service.icon} fs-3`}></i>
                      </div>

                      <h5 className="fw-bold">{service.title}</h5>
                      <p className="text-secondary small mb-0">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="section bg-dark text-white py-5" ref={statsRef}>
        <div className="container">
          <div className="row gy-4 text-center">
            <div className="col-6 col-md-3">
              <h3 className="display-6 fw-bold mb-1">{statsCount.projects}+</h3>
              <p className="mb-0 text-white-75">Projects Completed</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="display-6 fw-bold mb-1">{statsCount.volunteers}/7</h3>
              <p className="mb-0 text-white-75">Volunteer Support</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="display-6 fw-bold mb-1">{statsCount.people}K</h3>
              <p className="mb-0 text-white-75">People Helped</p>
            </div>
            <div className="col-6 col-md-3">
              <h3 className="display-6 fw-bold mb-1">{statsCount.awards}</h3>
              <p className="mb-0 text-white-75">Awards Won</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section py-5">
        <div className="container py-5">
          <div className="section-heading text-center mb-5">
            <span className="eyebrow text-brand">Gallery</span>
            <h2 className="fw-bold">Moments for our mission</h2>
          </div>
          <div className="row g-4">
            {galleryImages.map((image, index) => (
              <div className="col-6 col-lg-3" key={index}>
                <div className="gallery-item rounded-4 shadow-sm">
                  <img src={image.src} className="gallery-img" alt={image.title} />
                  <div className="gallery-overlay">
                    <h5 className="text-white mb-0">{image.title}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
