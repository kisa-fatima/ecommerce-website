import React from 'react';
import '../styles/StyleCards.css';

const StyleCards = ({ styles }) => {
  return (
    <div className="style-cards-grid">
      {styles.map((style, idx) => (
        <div className="style-card" key={idx}>
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
      ))}
    </div>
  );
};

export default StyleCards;
