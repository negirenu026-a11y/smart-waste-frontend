import React, { useState, useEffect } from 'react';
import axios from 'axios';


const api = import.meta.env.VITE_API_URL

const CityDataDisplay = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const states = ['Himachal Pradesh'];
  const citiesByState = {
    'Himachal Pradesh': ['Shimla', 'Kinnaur', 'Manali', 'Solan', 'Dharamshala']
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setCityData(null);
  };

  const handleCityChange = async (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    
    if (city) {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`api/${city}`);
        if (response.data.success) {
          setCityData(response.data.data);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        setError('Error connecting to server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="city-data-display p-4 bg-white rounded-4 shadow-sm border mt-4">
      <h3 className="mb-4 fw-bold" style={{ color: '#10b981' }}>City Information</h3>
      
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label fw-bold">Select State</label>
          <select 
            className="form-select" 
            value={selectedState} 
            onChange={handleStateChange}
          >
            <option value="">-- Select State --</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        
        <div className="col-md-6">
          <label className="form-label fw-bold">Select City</label>
          <select 
            className="form-select" 
            value={selectedCity} 
            onChange={handleCityChange}
            disabled={!selectedState}
          >
            <option value="">{selectedState ? '-- Select City --' : 'Select State First'}</option>
            {selectedState && citiesByState[selectedState].map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {cityData && !loading && (
        <div className="city-data-card bg-light p-4 rounded-3 border">
          <h4 className="mb-3 text-dark border-bottom pb-2">
            <i className="fas fa-map-marker-alt text-success me-2"></i>
            {cityData.city} <small className="text-muted fs-6">({cityData.state})</small>
          </h4>
          
          <div className="row g-4 mt-1">
            <div className="col-sm-6 col-md-3">
              <div className="d-flex flex-column bg-white p-3 rounded shadow-sm h-100">
                <span className="text-muted small text-uppercase mb-1">Zone</span>
                <strong className="fs-5">{cityData.zone}</strong>
              </div>
            </div>
            
            <div className="col-sm-6 col-md-3">
              <div className="d-flex flex-column bg-white p-3 rounded shadow-sm h-100">
                <span className="text-muted small text-uppercase mb-1">Complaints</span>
                <strong className="fs-5 text-danger">{cityData.totalComplaints}</strong>
              </div>
            </div>
            
            <div className="col-sm-6 col-md-3">
              <div className="d-flex flex-column bg-white p-3 rounded shadow-sm h-100">
                <span className="text-muted small text-uppercase mb-1">Workers Available</span>
                <strong className="fs-5 text-success">{cityData.workersAvailable}</strong>
              </div>
            </div>
            
            <div className="col-sm-6 col-md-3">
              <div className="d-flex flex-column bg-white p-3 rounded shadow-sm h-100">
                <span className="text-muted small text-uppercase mb-1">Total Areas</span>
                <strong className="fs-5 text-primary">{cityData.areas.length}</strong>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-top">
            <h6 className="fw-bold mb-2 text-secondary">Areas Covered:</h6>
            <div className="d-flex flex-wrap gap-2">
              {cityData.areas.map((area, index) => (
                <span key={index} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityDataDisplay;
