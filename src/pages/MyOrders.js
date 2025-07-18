import React, { useEffect, useState } from 'react';
import db from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const MyOrders = () => {
  const [user, setUser] = useState(null);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchUser = async () => {
      if (!userEmail) return;
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      let foundUser = null;
      querySnapshot.forEach(docSnap => {
        const userData = docSnap.data();
        if (userData.email && userData.email.trim().toLowerCase() === userEmail.trim().toLowerCase()) {
          foundUser = userData;
        }
      });
      setUser(foundUser);
    };
    fetchUser();
  }, [userEmail]);

  if (!user) {
    return <div style={{ padding: 32 }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>My Orders</h2>
      <div style={{ marginBottom: 32, padding: 20, background: '#f7f7f7', borderRadius: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 18 }}>{user.name}</div>
        <div style={{ color: '#555', fontSize: 15 }}>{user.email}</div>
      </div>
      <h3 style={{ marginBottom: 12 }}>Orders:</h3>
      {/* Orders list will go here in the future */}
    </div>
  );
};

export default MyOrders; 