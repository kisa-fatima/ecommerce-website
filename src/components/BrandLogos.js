import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import calvinKlein from '../assets/images/calvin klein.png';
import gucci from '../assets/images/gucci.png';
import prada from '../assets/images/prada.png';
import versace from '../assets/images/Versace.png';
import zara from '../assets/images/zara.png';
import '../styles/BrandLogos.css';

const logos = [
  { src: versace, alt: 'Versace' },
  { src: zara, alt: 'Zara' },
  { src: gucci, alt: 'Gucci' },
  { src: prada, alt: 'Prada' },
  { src: calvinKlein, alt: 'Calvin Klein' },
];

const settings = {
  dots: false,
  infinite: true,
  speed: 2000,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 0,
  cssEase: 'linear',
  arrows: false,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

const BrandLogos = () => (
  <div className="brand-logos-bar">
    <Slider {...settings} className="brand-logos-slider">
      {logos.map((logo) => (
        <div key={logo.alt} className="brand-logo-slide">
          <img
            src={logo.src}
            alt={logo.alt}
            className="brand-logo-img"
          />
        </div>
      ))}
    </Slider>
  </div>
);

export default BrandLogos; 