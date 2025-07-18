import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { fetchUserByEmail } from '../services/databaseFunctions';

const MyOrders = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const getUserAndOrders = async () => {
      setLoading(true);
      if (!userEmail) return;
      const result = await fetchUserByEmail(userEmail);
      if (result) {
        setUser(result.data);
        const userOrders = result.data.orders || [];
        if (userOrders.length > 0) {
          // Fetch each order by ID
          const orderDocs = await Promise.all(
            userOrders.map(async (orderId) => {
              const orderRef = doc(db, 'orders', orderId);
              const orderSnap = await getDoc(orderRef);
              if (orderSnap.exists()) {
                return { id: orderId, ...orderSnap.data() };
              }
              return null;
            })
          );
          setOrders(orderDocs.filter(Boolean));
        } else {
          setOrders([]);
        }
      } else {
        setUser(null);
        setOrders([]);
      }
      setLoading(false);
    };
    getUserAndOrders();
  }, [userEmail]);

  if (loading) {
    return <div style={{ padding: 32 }}>Loading...</div>;
  }

  if (!user) {
    return <div style={{ padding: 32 }}>User not found.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>My Orders</h2>
      <div style={{ marginBottom: 32, padding: 20, background: '#f7f7f7', borderRadius: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{user.name}</div>
        <div style={{ color: '#555', fontSize: 15 }}>{user.email}</div>
      </div>
      <h3 style={{ marginBottom: 12 }}>Orders:</h3>
      {orders.length === 0 ? (
        <div style={{ color: '#888', padding: 16 }}>No orders found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, background: '#fafbfc' }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Order ID: {order.id}</div>
              <div style={{ fontSize: 15, marginBottom: 4 }}>Placed on: {order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : String(order.createdAt)}</div>
              <div style={{ fontSize: 15, marginBottom: 4 }}>Total: <b>${order.totalAmount}</b></div>
              <div style={{ fontSize: 15, marginBottom: 4 }}>Status: <b>{order.status}</b></div>
              <div style={{ fontSize: 15, marginBottom: 4 }}>Products:</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {order.products && order.products.map((item, idx) => (
                  <li key={idx}>{item.name} x {item.quantity} (${item.price} each)</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders; 