import React from 'react';
import '../styles/StyleCards.css';
import { Link } from 'react-router-dom';

const StyleCards = ({ styles }) => {
  return (
    <div className="style-cards-grid">
      {styles.map((style, idx) => (
        <Link to={style.route} key={idx} style={{ textDecoration: 'none' }}>
          <div className="style-card">
            <div className="style-img-wrap">
              <img 
                src={style.image} 
                alt={style.label} 
                className={`style-img main${style.label === 'Formal' ? ' formal-main-img' : ''}${style.label === 'Casual' ? ' casual-main-img' : ''}`} 
              />
              <img 
                src={style.hoverImage} 
                alt={style.label + ' hover'} 
                className={`style-img hover${style.label === 'Casual' ? ' casual-hover-img' : ''}`} 
              />
            </div>
            <div className="style-label">{style.label}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StyleCards;
