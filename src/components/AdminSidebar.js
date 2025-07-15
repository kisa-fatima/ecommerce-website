import React from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  BoxPlotOutlined,
  RightOutlined
} from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Global.css';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/admin/dashboard',
    icon: <AppstoreOutlined />,
    label: <NavLink to="/admin/dashboard">Dashboard</NavLink>,
  },
  {
    key: '/admin/products',
    icon: <UnorderedListOutlined />,
    label: <NavLink to="/admin/products">Product catalog</NavLink>,
  },
  {
    key: '/admin/categories',
    icon: <BoxPlotOutlined />,
    label: <NavLink to="/admin/categories">Catalog management</NavLink>,
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const isMobile = window.innerWidth <= 600;

  if (isMobile) {
    return (
      <div
        className="admin-sidebar-mobile"
        style={{
          width: 56,
          minWidth: 56,
          maxWidth: 56,
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '60px 0 12px 0',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1,
          boxShadow: '2px 0 8px 0 rgba(0,0,0,0.04)',
        }}
      >
        {menuItems.map(item => (
          <NavLink
            key={item.key}
            to={item.key}
            style={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              marginBottom: 12,
              borderRadius: 8,
              background: location.pathname === item.key ? '#111' : '#fff',
              color: location.pathname === item.key ? '#fff' : '#222',
              boxShadow: location.pathname === item.key ? '0 2px 8px 0 rgba(0,0,0,0.10)' : 'none',
              fontSize: '1.3rem',
              position: 'relative',
              transition: 'background 0.2s, color 0.2s',
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: 48,
              marginLeft: 8,
            }}>{item.icon}</span>
          </NavLink>
        ))}
      </div>
    );
  }

  return (
    <Sider
      width={220}
      className="admin-sidebar-sticky"
      style={{ minHeight: '100vh', height: '100vh', overflowY: 'auto', background: '#fff', borderRight: '1px solid #f0f0f0' }}
    >
      <Menu
        mode="inline"
        selectedKeys={[location.pathname.startsWith('/admin') ? location.pathname : '/admin/dashboard']}
        style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default AdminSidebar;
