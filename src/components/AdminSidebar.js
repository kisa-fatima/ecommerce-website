import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  BoxPlotOutlined,
  UserOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/Global.css';

const { Sider } = Layout;

const menuItems = [
  {
    key: '/admin',
    icon: <AppstoreOutlined />,
    label: <NavLink to="/admin">Dashboard</NavLink>,
  },
  {
    key: '/admin/products',
    icon: <UnorderedListOutlined />,
    label: <NavLink to="/admin/products">Product catalog</NavLink>,
  },
  {
    key: '/admin/categories',
    icon: <BoxPlotOutlined />,
    label: <NavLink to="/admin/categories">Category management</NavLink>,
  },
  {
    key: '/admin/orders',
    icon: <ShoppingCartOutlined />,
    label: <NavLink to="/admin/orders">Orders</NavLink>,
  },
  {
    key: '/admin/users',
    icon: <UserOutlined />,
    label: <NavLink to="/admin/users">Users</NavLink>,
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
  function getSelectedKey(pathname) {
    // Find the menu item with the longest matching prefix
    let match = menuItems[0].key;
    let maxLength = 0;
    menuItems.forEach(item => {
      if (pathname.startsWith(item.key) && item.key.length > maxLength) {
        match = item.key;
        maxLength = item.key.length;
      }
    });
    return match;
  }
  const selectedKey = getSelectedKey(location.pathname);

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
