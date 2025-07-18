import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersCol = collection(db, 'users');
      const usersSnap = await getDocs(usersCol);
      const usersList = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>All Users</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7f7f7' }}>
              <th style={{ padding: 10, border: '1px solid #eee', textAlign: 'left' }}>Name</th>
              <th style={{ padding: 10, border: '1px solid #eee', textAlign: 'left' }}>Email</th>
              <th style={{ padding: 10, border: '1px solid #eee', textAlign: 'left' }}>Orders</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{user.name}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{user.email}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{user.orders ? user.orders.length : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers; 