import React from 'react';
import { Layout } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
// import PanelHeader from '../components/PanelHeader';

const { Content } = Layout;

const CouponsPlaceholder = () => (
  <div style={{ padding: 32 }}>
    <h2>Coupons</h2>
    <p>This feature is coming soon.</p>
  </div>
);

const AdminPanel = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout>
        {/* <PanelHeader /> */}
        <Layout>
          <div className="admin-sidebar-sticky-wrapper">
            <AdminSidebar />
          </div>
          <Content className="admin-content-mobile">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="coupons" element={<CouponsPlaceholder />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
