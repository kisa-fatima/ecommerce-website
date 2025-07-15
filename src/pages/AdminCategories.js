import React from 'react';
import { Table, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/AdminCategories.css';

const hierarchy = [
  {
    key: 'men',
    name: 'Men',
    children: [
      {
        key: 'men-gym',
        name: 'Gym',
        children: [
          { key: 'men-gym-top', name: 'Top' },
          { key: 'men-gym-bottom', name: 'Bottom' },
        ],
      },
      {
        key: 'men-party',
        name: 'Party',
        children: [
          { key: 'men-party-top', name: 'Top' },
          { key: 'men-party-bottom', name: 'Bottom' },
        ],
      },
      {
        key: 'men-casual',
        name: 'Casual',
        children: [
          { key: 'men-casual-top', name: 'Top' },
          { key: 'men-casual-bottom', name: 'Bottom' },
        ],
      },
      {
        key: 'men-formal',
        name: 'Formal',
        children: [
          { key: 'men-formal-top', name: 'Top' },
          { key: 'men-formal-bottom', name: 'Bottom' },
        ],
      },
    ],
  },
  {
    key: 'women',
    name: 'Women',
    children: [
      {
        key: 'women-gym',
        name: 'Gym',
        children: [
          { key: 'women-gym-top', name: 'Top' },
          { key: 'women-gym-bottom', name: 'Bottom' },
        ],
      },
      {
        key: 'women-party',
        name: 'Party',
        children: [
          { key: 'women-party-top', name: 'Top' },
          { key: 'women-party-bottom', name: 'Bottom' },
        ],
      },
      {
        key: 'women-casual',
        name: 'Casual',
        children: [
          { key: 'women-casual-top', name: 'Top' },
          { key: 'women-casual-bottom', name: 'Bottom' },
        ],
      },
      {
        key: 'women-formal',
        name: 'Formal',
        children: [
          { key: 'women-formal-top', name: 'Top' },
          { key: 'women-formal-bottom', name: 'Bottom' },
        ],
      },
    ],
  },
  {
    key: 'kids',
    name: 'Kids',
    children: [
      { key: 'kids-top', name: 'Top' },
      { key: 'kids-bottom', name: 'Bottom' },
    ],
  },
];

const columns = [
  {
    title: 'Category',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <span className="cat-name">{text}</span>,
  },
  {
    title: '',
    key: 'actions',
    width: 120,
    render: (_, record) => (
      <Space>
        <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" className="cat-add-btn" />
        <Button danger shape="circle" icon={<DeleteOutlined />} size="small" className="cat-del-btn" />
      </Space>
    ),
  },
];

const AdminCategories = () => {
  return (
    <div className="admin-categories-container">
      <h2 className="admin-categories-title">Catalog Management</h2>
      <Table
        columns={columns}
        dataSource={hierarchy}
        pagination={false}
        rowKey="key"
        expandable={{
          defaultExpandAllRows: true,
        }}
        className="admin-categories-table"
      />
    </div>
  );
};

export default AdminCategories;
