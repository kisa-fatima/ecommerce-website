import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import '../styles/AdminCategories.css';
import { getCategoryHierarchy } from '../services/databaseFunctions';
import { Modal, Input, Form, message } from 'antd';

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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addParentId, setAddParentId] = useState(null);
  const [form] = Form.useForm();

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

  // Handler for add button in table
  const handleAddClick = (parentId = null) => {
    setAddParentId(parentId);
    setAddModalOpen(true);
    form.resetFields();
  };

  // Handler for modal submit
  const handleAddCategory = () => {
    form.validateFields().then(values => {
      // Here you would call your addCategory function with values.name and addParentId
      message.success(`Category '${values.name}' would be added under parent ID: ${addParentId || 'root'}`);
      setAddModalOpen(false);
    });
  };

  // Handler for modal cancel
  const handleCancel = () => {
    setAddModalOpen(false);
  };

  // Updated columns to use handleAddClick
  const columnsWithAdd = [
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
          <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" className="cat-add-btn" onClick={() => handleAddClick(record.id)} />
          <Button danger shape="circle" icon={<DeleteOutlined />} size="small" className="cat-del-btn" />
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-categories-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 className="admin-categories-title" style={{ margin: 0 }}>Catalog Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ background: '#111', color: '#fff', border: 'none', fontWeight: 500 }}
          onClick={() => handleAddClick(null)}
          onMouseOver={e => e.currentTarget.style.background = '#888'}
          onMouseOut={e => e.currentTarget.style.background = '#111'}
        >
          Add Root Category
        </Button>
      </div>
      <Table
        columns={columnsWithAdd}
        dataSource={categories}
        pagination={false}
        rowKey="id"
        expandable={{
          defaultExpandAllRows: true,
        }}
        className="admin-categories-table"
        loading={loading}
      />
      <Modal
        title={addParentId ? 'Add Subcategory' : 'Add Root Category'}
        open={addModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{
              background: '#fff',
              color: '#111',
              border: '1.5px solid #bbb',
              boxShadow: 'none',
              fontWeight: 500
            }}
            onMouseOver={e => {
              e.currentTarget.style.border = '1.5px solid #111';
              e.currentTarget.style.color = '#111';
            }}
            onMouseOut={e => {
              e.currentTarget.style.border = '1.5px solid #bbb';
              e.currentTarget.style.color = '#111';
            }}
          >
            Cancel
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddCategory}
            style={{ background: '#111', color: '#fff', border: 'none', fontWeight: 500 }}
            onMouseOver={e => e.currentTarget.style.background = '#888'}
            onMouseOut={e => e.currentTarget.style.background = '#111'}
          >
            Add
          </Button>
        ]}
        okText="Add"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter a category name' }]}>
            <Input placeholder="Enter category name" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
