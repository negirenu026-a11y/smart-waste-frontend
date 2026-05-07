import React from 'react';

function Gallery() {
  const galleryItems = [
    '/img/gallery-1.jpg',
    '/img/gallery-2.jpg',
    '/img/gallery-3.jpg',
    '/img/gallery-4.jpg',
    '/img/gallery-5.jpg',
    '/img/gallery-footer-1.jpg',
  ];

  return (
    <div className="container-fluid gallery py-5">
      <div className="container pb-5">
        <div className="text-center mx-auto mb-5" style={{ maxWidth: '600px' }}>
          <h5 className="fw-bold text-primary text-uppercase">Our Gallery</h5>
          <h1 className="display-5 mb-0">Moments From Our Projects</h1>
        </div>
        
        <style>{`
          .gallery-item {
            position: relative;
            overflow: hidden;
            border-radius: 15px;
            cursor: pointer;
          }
          .gallery-img {
            transition: transform 0.5s ease;
            width: 100%;
            height: 300px;
            object-fit: cover;
          }
          .gallery-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(102, 126, 234, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.4s ease;
          }
          .gallery-item:hover .gallery-img {
            transform: scale(1.1);
          }
          .gallery-item:hover .gallery-overlay {
            opacity: 1;
          }
          .gallery-text {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            transform: translateY(20px);
            transition: transform 0.4s ease;
          }
          .gallery-item:hover .gallery-text {
            transform: translateY(0);
          }
        `}</style>

        <div className="row g-4">
          {galleryItems.map((src, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div className="gallery-item shadow-sm">
                <img src={src} alt={`Gallery ${index + 1}`} className="gallery-img" />
                <div className="gallery-overlay">
                  <span className="gallery-text">Beauty Of Life</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
