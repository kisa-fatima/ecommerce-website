import React, { useEffect, useState } from 'react';
import { Table, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '../styles/AdminCategories.css';
import { getCategoryHierarchy, addCategoryToDatabase, updateCategoryNameInDatabase, deleteCategoryFromDatabase } from '../services/databaseFunctions';
import { Modal, Input, Form, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editInitialName, setEditInitialName] = useState('');
  const [editForm] = Form.useForm();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleteCategoryName, setDeleteCategoryName] = useState('');

  // Responsive check for mobile (dynamic)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const handleAddCategory = async () => {
    try {
      const values = await form.validateFields();
      await addCategoryToDatabase(values.name, addParentId === null ? 0 : addParentId);
      message.success(`Category '${values.name}' added successfully!`);
      setAddModalOpen(false);
      // Refresh categories
      setLoading(true);
      const data = await getCategoryHierarchy();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      message.error('Failed to add category.');
    }
  };

  // Handler for modal cancel
  const handleCancel = () => {
    setAddModalOpen(false);
  };

  // Handler for edit button in table
  const handleEditClick = (category) => {
    setEditCategoryId(category.id);
    setEditInitialName(category.name);
    setEditModalOpen(true);
    editForm.setFieldsValue({ name: category.name });
  };

  // Handler for modal submit (edit)
  const handleEditCategory = async () => {
    try {
      const values = await editForm.validateFields();
      await updateCategoryNameInDatabase(editCategoryId, values.name);
      message.success(`Category name updated!`);
      setEditModalOpen(false);
      // Refresh categories
      setLoading(true);
      const data = await getCategoryHierarchy();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      message.error('Failed to update category.');
    }
  };

  // Handler for modal cancel (edit)
  const handleEditCancel = () => {
    setEditModalOpen(false);
  };

  // Handler for delete button in table
  const handleDeleteClick = (category) => {
    setDeleteCategoryId(category.id);
    setDeleteCategoryName(category.name);
    setDeleteConfirmOpen(true);
  };

  // Handler for confirming delete
  const handleDeleteCategory = async () => {
    setDeleteLoading(true);
    try {
      await deleteCategoryFromDatabase(deleteCategoryId);
      message.success(`Category '${deleteCategoryName}' deleted!`);
      setDeleteConfirmOpen(false);
      // Refresh categories
      setLoading(true);
      const data = await getCategoryHierarchy();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      message.error('Failed to delete category.');
    }
    setDeleteLoading(false);
  };

  // Handler for canceling delete
  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };

  // Updated columns to use handleAddClick, handleEditClick, handleDeleteClick
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
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} size="small" className="cat-add-btn" onClick={() => handleAddClick(record.id)} />
          <Button shape="circle" icon={<EditOutlined />} size="small" className="cat-edit-btn" onClick={() => handleEditClick(record)} />
          <Button danger shape="circle" icon={<DeleteOutlined />} size="small" className="cat-del-btn" onClick={() => handleDeleteClick(record)} />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'flex-end', marginBottom: 16 }}>
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
        loading={{ spinning: loading, indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#111' }} spin />} /> }}
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
      <Modal
        title="Edit Category Name"
        open={editModalOpen}
        onCancel={handleEditCancel}
        footer={[
          <Button
            key="cancel"
            onClick={handleEditCancel}
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
            key="edit"
            type="primary"
            onClick={handleEditCategory}
            style={{ background: '#111', color: '#fff', border: 'none', fontWeight: 500 }}
            onMouseOver={e => e.currentTarget.style.background = '#888'}
            onMouseOut={e => e.currentTarget.style.background = '#111'}
          >
            Save
          </Button>
        ]}
        okText="Save"
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" initialValues={{ name: editInitialName }}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true, message: 'Please enter a category name' }]}>
            <Input placeholder="Enter new category name" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Delete Category"
        open={deleteConfirmOpen}
        onOk={handleDeleteCategory}
        onCancel={handleDeleteCancel}
        okText="Delete"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        cancelButtonProps={{ disabled: deleteLoading }}
        destroyOnClose
      >
        <p>Are you sure you want to delete category '<b>{deleteCategoryName}</b>'?</p>
      </Modal>
    </div>
  );
};

export default AdminCategories;
