import { NavLink } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer py-5 bg-dark text-light">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <h5 className="mb-3 text-brand">WasteWise</h5>
            <p className="footer-text">
              WasteWise - A smart waste management system for cleaner cities
              and better living. Report complaints and manage municipal services.
            </p>
          </div>
          <div className="col-md-4">
            <h6 className="mb-3">Quick links</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/services">Services</NavLink>
              </li>
              <li>
                <NavLink to="/causes">Causes</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6 className="mb-3">Contact</h6>
            <p className="mb-1">Sector 74 ,Phase 8b mohali(Punjab)</p>
            <p className="mb-1">negirenu026@gmail.com</p>
            <p>+91 86289-71014</p>
          </div>
        </div>
        <div className="footer-bottom text-center mt-4 pt-3 border-top border-secondary opacity-75">
          <small>© 2026 WasteWise. Smart Waste Management System.</small>
        </div>
      </div>
    </footer>
  )
}

export default Footer
