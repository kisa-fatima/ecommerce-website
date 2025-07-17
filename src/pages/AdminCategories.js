import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
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
        <Button danger shape="circle" icon={<DeleteOutlined />} size="small" className="cat-del-btn" />
      </Space>
    ),
  },
];

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
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

  // Flatten categories for dropdown
  const flattenCategories = (cats) => {
    let result = [];
    for (const cat of cats) {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        result = result.concat(flattenCategories(cat.children));
      }
    }
    return result;
  };
  const flatCategories = flattenCategories(categories);

  const handleAddCategory = () => {
    form.validateFields().then(values => {
      // For now, just close the modal and reset
      setAddModalOpen(false);
      form.resetFields();
      message.success('Category added (not yet saved to DB)');
    });
  };

  return (
    <div className="admin-categories-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="admin-categories-title">Catalog Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />} 
          style={{ float: 'right', marginLeft: 'auto', background: '#111', border: 'none' }}
          onClick={() => setAddModalOpen(true)}
          onMouseOver={e => e.currentTarget.style.background = '#888'}
          onMouseOut={e => e.currentTarget.style.background = '#111'}
        >
          Add
        </Button>
      </div>
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
      <Modal
        title="Add Category"
        open={addModalOpen}
        onCancel={() => { setAddModalOpen(false); form.resetFields(); }}
        onOk={handleAddCategory}
        okText="Add"
        destroyOnClose
        okButtonProps={{
          style: { background: '#111', border: 'none', fontWeight: 500 },
          onMouseOver: e => e.currentTarget.style.background = '#888',
          onMouseOut: e => e.currentTarget.style.background = '#111',
        }}
        cancelButtonProps={{
          style: { color: '#111', border: '1.5px solid #bbb', fontWeight: 500 },
          onMouseOver: e => {
            e.currentTarget.style.color = '#111';
            e.currentTarget.style.border = '1.5px solid #111';
          },
          onMouseOut: e => {
            e.currentTarget.style.color = '#111';
            e.currentTarget.style.border = '1.5px solid #bbb';
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter a category name' }]}> 
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item name="parent" label="Parent Category" initialValue={null}>
            <Select placeholder="Select parent category">
              <Select.Option value={null}>None</Select.Option>
              {flatCategories.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCategories;
