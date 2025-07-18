import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  BoxPlotOutlined
} from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Global.css';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/admin-dashboard',
    icon: <AppstoreOutlined />,
    label: <NavLink to="/admin-dashboard">Dashboard</NavLink>,
  },
  {
    key: '/admin-dashboard/products',
    icon: <UnorderedListOutlined />,
    label: <NavLink to="/admin-dashboard/products">Product catalog</NavLink>,
  },
  {
    key: '/admin-dashboard/categories',
    icon: <BoxPlotOutlined />,
    label: <NavLink to="/admin-dashboard/categories">Category management</NavLink>,
  }
];

const AdminSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(window.innerWidth <= 900);
  const [collapsedWidth, setCollapsedWidth] = useState(window.innerWidth <= 900 ? 48 : 80);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= 900);
      setCollapsedWidth(window.innerWidth <= 900 ? 48 : 80);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ensure the correct menu item is selected
  const selectedKey = menuItems.find(item => location.pathname.startsWith(item.key))?.key || '/admin-dashboard';

  // Only show border when not collapsed
  const siderStyle = collapsed
    ? { background: '#fff', minHeight: '100vh', borderRight: 'none' }
    : { background: '#fff', minHeight: '100vh', borderRight: '1px solid #f0f0f0' };

  return (
    <Sider
      className="admin-sidebar-sticky"
      width={220}
      collapsedWidth={collapsedWidth}
      style={siderStyle}
      collapsible={window.innerWidth <= 900}
      collapsed={collapsed}
      trigger={null}
    >
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
        items={menuItems}
      />
    </Sider>
  );
};

export default AdminSidebar;
