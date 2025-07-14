import React from 'react';
import Breadcrumbs from './Breadcrumbs';
import '../styles/PageBanner.css';

const PageBanner = ({ image, title, description }) => (
  <div className="page-banner">
    <div className="page-banner__text">
      <div className="page-banner__breadcrumbs">
        <Breadcrumbs white />
      </div>
      <h1 className="page-banner__title">{title}</h1>
      <p className="page-banner__desc">{description}</p>
    </div>
    <div className="page-banner__img-container">
      <img src={image} alt={title} className="page-banner__img" />
    </div>
  </div>
);

export default PageBanner;
