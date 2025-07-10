import React from 'react';
import '../styles/BrowseByStyle.css';

const styles = [
  {
    label: 'Casual',
    image: require('../assets/images/casual1.jpg'),
    hoverImage: require('../assets/images/casual2.jpg'),
  },
  {
    label: 'Formal',
    image: require('../assets/images/formal1.jpg'),
    hoverImage: require('../assets/images/formal2.jpg'),
  },
  {
    label: 'Party',
    image: require('../assets/images/party1.jpg'),
    hoverImage: require('../assets/images/party2.jpg'),
  },
  {
    label: 'Gym',
    image: require('../assets/images/gym1.jpg'),
    hoverImage: require('../assets/images/gym2.jpg'),
  },
];

const BrowseByStyle = () => (
  <section className="browse-style-section">
    <h2 className="browse-style-title">BROWSE BY DRESS STYLE</h2>
    <div className="browse-style-grid">
      {styles.map((style, idx) => (
        <div className="browse-style-card" key={idx}>
          <div className="browse-style-img-wrap">
            <img src={style.image} alt={style.label} className={`browse-style-img main${style.label === 'Formal' ? ' formal-main-img' : ''}${style.label === 'Casual' ? ' casual-main-img' : ''}`} />
            <img src={style.hoverImage} alt={style.label + ' hover'} className={`browse-style-img hover${style.label === 'Casual' ? ' casual-hover-img' : ''}`} />
          </div>
          <div className="browse-style-label">{style.label}</div>
        </div>
      ))}
    </div>
  </section>
);

export default BrowseByStyle; 