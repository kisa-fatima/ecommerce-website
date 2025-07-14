import React from 'react';
import StyleCards from './StyleCards';
import '../styles/BrowseByStyle.css';

const styles = [
  {
    label: 'Casual',
    image: require('../assets/images/casual1.jpg'),
    hoverImage: require('../assets/images/casual2.jpg'),
    route: '/casual'
  },
  {
    label: 'Formal',
    image: require('../assets/images/formal1.jpg'),
    hoverImage: require('../assets/images/formal2.jpg'),
    route: '/formal'
  },
  {
    label: 'Party',
    image: require('../assets/images/party1.jpg'),
    hoverImage: require('../assets/images/party2.jpg'),
    route: '/party'
  },
  {
    label: 'Gym',
    image: require('../assets/images/gym1.jpg'),
    hoverImage: require('../assets/images/gym2.jpg'),
    route: '/gym'
  },
];

const BrowseByStyle = () => (
  <section className="browse-style-section">
    <h2 className="browse-style-title">BROWSE BY DRESS STYLE</h2>
    <StyleCards styles={styles} />
  </section>
);

export default BrowseByStyle; 