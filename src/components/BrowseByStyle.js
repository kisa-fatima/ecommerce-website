import React from 'react';
import '../styles/BrowseByStyle.css';

const styles = [
  {
    label: 'Casual',
    image: 'https://via.placeholder.com/300x200?text=Casual',
  },
  {
    label: 'Formal',
    image: 'https://via.placeholder.com/300x200?text=Formal',
  },
  {
    label: 'Party',
    image: 'https://via.placeholder.com/300x200?text=Party',
  },
  {
    label: 'Gym',
    image: 'https://via.placeholder.com/300x200?text=Gym',
  },
];

const BrowseByStyle = () => (
  <section className="browse-style-section">
    <h2 className="browse-style-title">BROWSE BY DRESS STYLE</h2>
    <div className="browse-style-grid">
      {styles.map((style, idx) => (
        <div className="browse-style-card" key={idx}>
          <img src={style.image} alt={style.label} className="browse-style-img" />
          <div className="browse-style-label">{style.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default BrowseByStyle; 