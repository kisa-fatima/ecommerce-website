import React from 'react';
import { Button, Row, Col } from 'antd';
import CountUp from 'react-countup';
import '../styles/HomeHero.css';

const HomeHero = () => (
  <div className="home-hero">
    <Row gutter={0} align="middle" justify="start">
      <Col xs={24} md={24} className="home-hero__left">
        <h1 className="home-hero__title">FIND CLOTHES<br />THAT MATCHES<br />YOUR STYLE</h1>
        <p className="home-hero__subtitle">
          Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
        </p>
        <Button type="primary" className="home-hero__btn" size="large" shape="round">Shop Now</Button>
        <div className="home-hero__stats">
          <div className="home-hero__stat">
            <div className="home-hero__stat-value"><CountUp end={200} duration={2} />+</div>
            <div className="home-hero__stat-label">International Brands</div>
          </div>
          <div className="home-hero__stat">
            <div className="home-hero__stat-value"><CountUp end={2000} duration={2} separator="," />+</div>
            <div className="home-hero__stat-label">High-Quality Products</div>
          </div>
          <div className="home-hero__stat">
            <div className="home-hero__stat-value"><CountUp end={30000} duration={2.5} separator="," />+</div>
            <div className="home-hero__stat-label">Happy Customers</div>
          </div>
        </div>
      </Col>
    </Row>
  </div>
);

export default HomeHero;
