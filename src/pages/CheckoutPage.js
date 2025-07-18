import React, { useEffect, useState } from 'react';
import '../styles/CheckoutPage.css';
import OrderSum from '../components/OrderSum';
import { Row, Col } from 'antd';
import AccountForm from '../components/AccountForm';
import { fetchUserByEmail } from '../services/databaseFunctions';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import db, { auth } from '../firebase';
import { collection, addDoc, updateDoc, doc, increment, arrayUnion } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  phone: Yup.string().required('Phone number is required'),
  email: Yup.string().email('Invalid email'),
});

const status = null;

const CheckoutPage = () => {
  const [initialValues, setInitialValues] = useState({ name: '', address: '', phone: '', email: '' });
  const cart = useSelector(state => state.cart.items);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const getUser = async () => {
      if (!userEmail) return;
      const result = await fetchUserByEmail(userEmail);
      if (result) {
        const data = result.data;
        setInitialValues({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
        });
      }
    };
    getUser();
  }, []);

  const handlePlaceOrder = async (values, { setSubmitting, resetForm }) => {
    try {
    if (!user) {
        toast.error('You must be logged in to place an order.');
        return;
      }
      if (!cart.length) {
        toast.error('Your cart is empty.');
      return;
    }
      // Prepare order data
      const orderData = {
        userID: user.uid || user.id,
        products: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 15, // subtotal + delivery
        paymentMethod: 'COD',
        status: 'pending',
        createdAt: new Date(),
        shippingDetails: {
          name: values.name,
          address: values.address,
          phone: values.phone,
          email: values.email,
        },
      };
      // Add order to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), orderData);
      // Add order ID to user's orders array
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        orders: arrayUnion(orderRef.id)
      });
      // Update each product's soldCount and quantity
      for (const item of cart) {
        const productRef = doc(db, 'products', item.id);
        await updateDoc(productRef, {
          soldCount: increment(item.quantity),
          quantity: increment(-item.quantity),
        });
      }
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      resetForm();
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-container">
      <ToastContainer position="top-center" autoClose={1500} />
      <div className="checkout-page-inner">
        <Row gutter={32} justify="center" align="top" style={{width: '100%'}}>
          <Col xs={24} md={15} lg={15} xl={15} className="checkout-page-left" style={{paddingTop: 0}}>
            <div className="checkout-form-wrapper">
              <h1 className="checkout-title" style={{ marginLeft: 0, paddingLeft: 0, textAlign: 'left' }}>Checkout</h1>
              <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={handlePlaceOrder}
              >
                {({ values, isValid, dirty, handleSubmit, isSubmitting }) => (
                  <>
                    <AccountForm
                      status={status}
                      showSubmit={false}
                    />
                    <button
                      type="button"
                      className="order-summary-checkout-btn"
                      style={{ width: '100%', marginTop: 8 }}
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <span>
                          <span className="spinner" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                            <svg width="18" height="18" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                              <g fill="none" fillRule="evenodd">
                                <g transform="translate(1 1)" strokeWidth="3">
                                  <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
                                  <path d="M36 18c0-9.94-8.06-18-18-18">
                                    <animateTransform
                                      attributeName="transform"
                                      type="rotate"
                                      from="0 18 18"
                                      to="360 18 18"
                                      dur="1s"
                                      repeatCount="indefinite" />
                                  </path>
                                </g>
                              </g>
                            </svg>
                          </span>
                          Placing Order...
                        </span>
                      ) : (
                        <>Place Order <span className="arrow">→</span></>
                      )}
                    </button>
                  </>
                )}
              </Formik>
            </div>
          </Col>
          <Col xs={24} md={9} lg={7} xl={6} className="checkout-page-right">
            <OrderSum showCheckoutBtn={false} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CheckoutPage; 