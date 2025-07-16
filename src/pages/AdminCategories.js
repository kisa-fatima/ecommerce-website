import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/AdminCategories.css';
import { getCategoryHierarchy } from '../services/databaseFunctions';

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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const data = await getCategoryHierarchy();
        setCategories(data);
      } catch (err) {
        setCategories([]);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="admin-categories-container">
      <h2 className="admin-categories-title">Catalog Management</h2>
      <Table
        columns={columns}
        dataSource={categories}
        pagination={false}
        rowKey="id"
        expandable={{
          defaultExpandAllRows: true,
        }}
        className="admin-categories-table"
        loading={loading}
      />
    </div>
  );
};

export default AdminCategories;
