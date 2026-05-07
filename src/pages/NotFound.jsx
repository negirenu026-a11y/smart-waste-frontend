import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="section py-5 text-center">
      <div className="container">
        <h1 className="display-4 fw-bold">404</h1>
        <p className="lead text-secondary">Page not found.</p>
        <Link to="/" className="btn btn-warning text-dark">
          Return home
        </Link>
      </div>
    </section>
  )
}

export default NotFound
