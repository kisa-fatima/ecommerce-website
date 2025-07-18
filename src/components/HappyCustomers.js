import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/HappyCustomers.css';

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    text: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: 'Alex K.',
    text: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
  },
  {
    id: 3,
    name: 'James L.',
    text: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: 4,
    name: 'Priya S.',
    text: "Shop.co has become my go-to for all things fashion. The quality, variety, and customer service are top-notch. Highly recommended!",
  },
  {
    id: 5,
    name: 'Carlos D.',
    text: "I love how easy it is to find exactly what I'm looking for on Shop.co. The site is user-friendly, and the clothes always arrive on time and as described.",
  },
  {
    id: 6,
    name: 'Emily R.',
    text: "The customer support at Shop.co is fantastic. They helped me with sizing and returns quickly and kindly. I always feel valued as a customer.",
  },
  {
    id: 7,
    name: 'Mohammed A.',
    text: "Great prices, fast shipping, and a huge selection. Shop.co is my favorite place to shop for clothes online!",
  },
  {
    id: 8,
    name: 'Linda W.',
    text: "I get compliments every time I wear something from Shop.co. The styles are trendy and the quality is excellent.",
  },
  {
    id: 9,
    name: 'Chen Z.',
    text: "Shop.co makes it easy to stay on top of the latest fashion trends. I love their curated collections!",
  },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 600);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

function TestimonialCard({ t }) {
  return (
    <div className="happy-customer-card">
      <div className="happy-customer-stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="star filled">★</span>
        ))}
      </div>
      <div className="happy-customer-name">
        <b>{t.name}</b>
        <span className="happy-customer-check">✔</span>
      </div>
      <div className="happy-customer-text">{t.text}</div>
    </div>
  );
}

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className + ' custom-slick-arrow'}
      style={{ ...style, right: '-24px' }}
      onClick={onClick}
      aria-label="Next"
      type="button"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3L12 9L6 15" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <button
      className={className + ' custom-slick-arrow'}
      style={{ ...style, left: '-24px' }}
      onClick={onClick}
      aria-label="Previous"
      type="button"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L6 9L12 15" stroke="#111" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

const settings = {
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  draggable: true,
  swipe: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const HappyCustomers = () => {
  const isMobile = useIsMobile();
  return (
    <section className="happy-customers-section">
      <h2 className="happy-customers-title">OUR HAPPY CUSTOMERS</h2>
      {isMobile ? (
        <div className="happy-customers-grid">
          {testimonials.filter(t => t.id === 7 || t.id === 9).map((t) => (
            <TestimonialCard t={t} key={t.id} />
          ))}
        </div>
      ) : (
        <Slider {...settings} className="happy-customers-slider">
          {testimonials.map((t, idx) => (
            <TestimonialCard t={t} key={idx} />
          ))}
        </Slider>
      )}
    </section>
  );
};

export default HappyCustomers; 