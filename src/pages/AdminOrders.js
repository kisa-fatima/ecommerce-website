import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Select } from 'antd';

const statusOptions = [
  { value: 'pending', label: 'In Process' },
  { value: 'delivering', label: 'Delivering' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrdersAndUsers = async () => {
      setLoading(true);
      // Fetch all orders
      const ordersSnap = await getDocs(collection(db, 'orders'));
      const ordersList = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Fetch all users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersMap = {};
      usersSnap.docs.forEach(doc => {
        usersMap[doc.id] = doc.data();
      });
      setOrders(ordersList);
      setUsers(usersMap);
      setLoading(false);
    };
    fetchOrdersAndUsers();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>All Orders</h2>
      {loading ? (
        <div>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7f7f7' }}>
                <th style={{ padding: 10, border: '1px solid #eee', textAlign: 'left' }}>User</th>
                <th style={{ padding: 10, border: '1px solid #eee', textAlign: 'left' }}>Order Details</th>
                <th style={{ padding: 10, border: '1px solid #eee', textAlign: 'left' }}>Total Bill</th>
                <th style={{ padding: 10, border: '1px solid #eee', textAlign: 'left' }}>Placed On</th>
                <th style={{ padding: 10, border: '1px solid #eee', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
                .map(order => {
                  const user = users[order.userID] || {};
                  return (
                    <tr key={order.id}>
                      <td style={{ padding: 10, border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 600 }}>{user.name || 'Unknown'}</div>
                        <div style={{ color: '#888', fontSize: 13 }}>{user.email || ''}</div>
                      </td>
                      <td style={{ padding: 10, border: '1px solid #eee' }}>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {order.products && order.products.map((item, idx) => (
                            <li key={idx}>{item.name} x {item.quantity} (${item.price} each)</li>
                          ))}
                        </ul>
                      </td>
                      <td style={{ padding: 10, border: '1px solid #eee' }}>
                        <b>${order.totalAmount}</b>
                      </td>
                      <td style={{ padding: 10, border: '1px solid #eee' }}>
                        {order.createdAt && order.createdAt.toDate ? order.createdAt.toDate().toLocaleString() : String(order.createdAt)}
                      </td>
                      <td style={{ padding: 10, border: '1px solid #eee' }}>
                        <Select
                          value={order.status}
                          onChange={val => handleStatusChange(order.id, val)}
                          style={{ minWidth: 120 }}
                          options={statusOptions}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 