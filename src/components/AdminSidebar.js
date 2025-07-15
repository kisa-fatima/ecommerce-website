import React from 'react';
import { Layout, Menu, Tag } from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  GiftOutlined,
  BoxPlotOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';

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
  {
    key: '/admin/coupons',
    icon: <GiftOutlined />,
    label: <span style={{display:'flex',alignItems:'center',gap:4}}><NavLink to="/admin/coupons">Coupons</NavLink> <Tag color="default" style={{marginLeft:4}}>New</Tag></span>,
  },
  {
    key: 'feedback',
    icon: <MessageOutlined />,
    label: <span style={{color:'#bfbfbf'}}>Feedback</span>,
    disabled: true,
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  return (
    <Sider width={220} style={{ background: '#fff', minHeight: '100vh', borderRight: '1px solid #f0f0f0' }}>
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
