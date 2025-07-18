import React from 'react'
import Cart from '../components/Cart';
import OrderSum from '../components/OrderSum';
import { Row, Col } from 'antd';
import '../styles/CartPage.css';

const CartPage = () => {
    return (
      <div className="cart-page-container">
        <div className="cart-page-inner">
          <h1 className="cart-title">YOUR CART</h1>
          <Row gutter={32} justify="center" align="top" style={{width: '100%'}}>
            <Col xs={24} md={15} lg={15} xl={15} className="cart-page-left">
              <Cart />
            </Col>
            <Col xs={24} md={9} lg={7} xl={6} className="cart-page-right">
              <OrderSum />
            </Col>
          </Row>
        </div>
      </div>
    );
  }

export default CartPage