import React, { useState } from 'react';
import { Table, Tag, Tooltip, Button } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import AddProductModal from './AddProductModal';

const initialData = [
  {
    key: 1,
    name: 'Item no.1',
    category: 'Men',
    type: 'Gym',
    ordered: 2,
    revenue: 59,
    catalog: 'Active',
    stock: 'In stock',
  },
  {
    key: 2,
    name: 'Item no.2',
    category: 'Men',
    type: 'Party',
    ordered: 5,
    revenue: 113,
    catalog: 'Deleted',
    stock: 'Out of stock',
  },
  {
    key: 3,
    name: 'Item no.3',
    category: 'Women',
    type: 'Formal',
    ordered: 0,
    revenue: 0,
    catalog: 'Active',
    stock: 'In stock',
  },
  {
    key: 4,
    name: 'Item no.4',
    category: 'Women',
    type: 'Casual',
    ordered: 0,
    revenue: 0,
    catalog: 'Out of stock',
    stock: 'Out of stock',
  },
  {
    key: 5,
    name: 'Item no.5',
    category: 'Kids',
    type: 'Gym',
    ordered: 0,
    revenue: 0,
    catalog: 'Inactive',
    stock: 'Out of stock',
  },
  {
    key: 6,
    name: 'Item no.6',
    category: 'Kids',
    type: 'Party',
    ordered: 12,
    revenue: 231,
    catalog: 'Inactive',
    stock: 'In stock',
  },
];

const CatalogStatus = ({ status }) => {
  let color = 'green';
  if (status === 'Deleted') color = 'red';
  else if (status === 'Inactive' || status === 'Out of stock') color = 'gray';
  return <Tag color={color}>{status}</Tag>;
};

const StockStatus = ({ status }) => (
  <span style={{ color: status === 'In stock' ? '#52c41a' : '#888' }}>{status}</span>
);

const Actions = () => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Tooltip title="View"><Button icon={<EyeOutlined />} size="small" /></Tooltip>
    <Tooltip title="Edit"><Button icon={<EditOutlined />} size="small" /></Tooltip>
    <Tooltip title="Delete"><Button icon={<DeleteOutlined />} size="small" danger /></Tooltip>
  </div>
);

const columns = [
  {
    title: 'Product name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text) => <b>{text}</b>,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    sorter: (a, b) => a.category.localeCompare(b.category),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    sorter: (a, b) => a.type.localeCompare(b.type),
  },
  {
    title: 'Ordered Items',
    dataIndex: 'ordered',
    sorter: (a, b) => a.ordered - b.ordered,
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    sorter: (a, b) => a.revenue - b.revenue,
  },
  {
    title: 'Catalog...',
    dataIndex: 'catalog',
    render: (status) => <CatalogStatus status={status} />,
  },
  {
    title: 'Stock status',
    dataIndex: 'stock',
    render: (status) => <StockStatus status={status} />,
  },
  {
    title: '',
    key: 'actions',
    render: () => <Actions />,
  },
];

const ProductCatalogTable = () => {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = (product) => {
    setData([
      ...data,
      {
        key: Date.now(),
        name: product.name,
        category: product.category,
        type: product.type,
        ordered: 0,
        revenue: 0,
        catalog: 'Active',
        stock: 'In stock',
        image: product.image,
      },
    ]);
    setModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          icon={<PlusOutlined />} 
          onClick={() => setModalOpen(true)}
          style={{ background: '#111', color: '#fff', border: 'none' }}
        >
          Add
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{ type: 'checkbox' }}
        pagination={false}
        bordered
        style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
      />
      <AddProductModal visible={modalOpen} onCancel={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  );
};

export default ProductCatalogTable; 