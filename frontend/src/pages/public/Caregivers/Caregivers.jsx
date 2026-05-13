import React, { useState } from 'react';
import './Caregivers.css';

const caregiversData = [
  {
    id: 1,
    name: "Dr. Elena Rodriguez",
    title: "GERIATRIC SPECIALIST",
    price: "$45",
    rating: "4.9",
    reviews: 124,
    tags: ["12 Years Exp.", "In-home"],
    quote: '"I believe in providing care that honors the dignity of every individual. Specialized in dementia support and palliative care, ensuring..."',
    image: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: 2,
    name: "Marcus Thompson, CNA",
    title: "PHYSICAL REHAB ASSISTANT",
    price: "$38",
    rating: "4.8",
    reviews: 89,
    tags: ["8 Years Exp.", "CPR Certified"],
    quote: '"Focusing on mobility and restorative exercises to help seniors regain independence. Dedicated to safety, patience, and positive..."',
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    title: "REGISTERED NURSE (RN)",
    price: "$52",
    rating: "5.0",
    reviews: 210,
    tags: ["15 Years Exp.", "Clinical Exp."],
    quote: '"Bringing hospital-level clinical precision to your home. Expert in medication management and post-surgical recovery for long-term health."',
    image: "https://i.pravatar.cc/150?img=44"
  },
  {
    id: 4,
    name: "Linda Chen",
    title: "COMPANION CARE SPECIALIST",
    price: "$32",
    rating: "4.7",
    reviews: 54,
    tags: ["5 Years Exp.", "Meal Prep"],
    quote: '"I provide more than just help; I provide companionship. I love engaging in storytelling, light gardening, and preparing nutritious, hom..."',
    image: "https://i.pravatar.cc/150?img=5"
  }
];

const Caregivers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="caregivers-page">
      <div className="container">
        {/* Header Section */}
        <div className="caregivers-header">
          <h1>Find Your <span className="text-teal">Caregiver</span></h1>
          <p className="caregivers-subtitle">
            We believe every family deserves a sanctuary of support. Connect with verified
            specialists who bring expertise, empathy, and warmth to your home.
          </p>
        </div>

        {/* Filter Section Desktop */}
        <div className="filters-container desktop-filters">
          <div className="search-input-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search by name, specialty, or keywords..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="dropdowns-group">
            <select className="filter-select">
              <option>Rating: Any</option>
              <option>4.5 &amp; up</option>
              <option>4.0 &amp; up</option>
            </select>
            <select className="filter-select">
              <option>Experience</option>
              <option>5+ Years</option>
              <option>10+ Years</option>
            </select>
            <select className="filter-select">
              <option>Price Range</option>
              <option>Under $30/hr</option>
              <option>$30 - $50/hr</option>
              <option>$50+/hr</option>
            </select>
            <button className="btn btn-primary update-btn">Update Results</button>
          </div>
        </div>

        {/* Filter Section Mobile */}
        <div className="filters-container mobile-filters">
           <div className="mobile-search-row">
             <div className="search-input-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text" 
                placeholder="Search by name or specialty..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn-icon-filter">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
            </button>
           </div>
           <div className="mobile-pills">
             <button className="pill active">Top Rated</button>
             <button className="pill">Near Me</button>
             <button className="pill">Registered Nurse</button>
           </div>
        </div>

        {/* Caregiver Grid */}
        <div className="caregivers-grid">
          {caregiversData.map((caregiver) => (
            <div className="caregiver-card" key={caregiver.id}>
              <div className="card-top-section">
                <div className="avatar-wrapper">
                  <div className="avatar-bg"></div>
                  <img src={caregiver.image} alt={caregiver.name} className="avatar-img" />
                  <div className="verified-badge">
                    <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                    </svg>
                    <span>VERIFIED</span>
                  </div>
                </div>
                <div className="price-rating">
                  <div className="price">{caregiver.price}<span className="unit">/hr</span></div>
                  <div className="rating">
                    <span className="star">★</span> {caregiver.rating} <span className="reviews">({caregiver.reviews})</span>
                  </div>
                </div>
              </div>
              
              <div className="card-content">
                <h3 className="caregiver-name">{caregiver.name}</h3>
                <p className="caregiver-title">{caregiver.title}</p>
                
                <div className="tags-container">
                  {caregiver.tags.map((tag, index) => (
                    <span className="tag" key={index}>{tag}</span>
                  ))}
                </div>
                
                <p className="caregiver-quote">{caregiver.quote}</p>
                
                <button className="btn-view-profile">View Profile</button>
              </div>
            </div>
          ))}

          {/* Promotional Banner */}
          <div className="promo-banner">
            <div className="promo-content">
              <h2>Need help choosing the right fit?</h2>
              <p>Our Family Concierge team can help you navigate profiles, conduct interviews, and find the perfect specialist for your unique needs.</p>
              <div className="promo-buttons">
                <button className="btn btn-primary btn-talk">Talk to a Specialist</button>
                <button className="btn btn-outline-white">How it Works</button>
              </div>
            </div>
            <div className="promo-graphic">
               <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="background-hands">
                  <path d="M20.5 9.5L12 18l-8.5-8.5a5.5 5.5 0 0 1 7.78-7.78L12 2.83l.72-.71a5.5 5.5 0 0 1 7.78 7.78z"></path>
               </svg>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="page-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <span className="page-text">Page 1 of 12</span>
          <button className="page-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

      </div>
    </div>
  );
};

export default Caregivers;
