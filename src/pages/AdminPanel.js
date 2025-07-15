import React from 'react';
import { Layout } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import PanelHeader from '../components/PanelHeader';

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
        <PanelHeader />
        <Layout>
          <div className="admin-sidebar-sticky-wrapper">
            <AdminSidebar />
          </div>
          <Content className="admin-content-mobile">
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="coupons" element={<CouponsPlaceholder />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPanel;
