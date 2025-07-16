import React from 'react';
import { Table, Tag, Tooltip, Button } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

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
    render: (catArr) => Array.isArray(catArr) && catArr[0] ? catArr[0].charAt(0).toUpperCase() + catArr[0].slice(1) : '',
    sorter: (a, b) => {
      const aCat = Array.isArray(a.category) && a.category[0] ? a.category[0] : '';
      const bCat = Array.isArray(b.category) && b.category[0] ? b.category[0] : '';
      return aCat.localeCompare(bCat);
    },
  },
  {
    title: 'Sub-category',
    dataIndex: 'category',
    render: (catArr) => Array.isArray(catArr) && catArr[2] ? catArr[2].charAt(0).toUpperCase() + catArr[2].slice(1) : '',
    sorter: (a, b) => {
      const aSub = Array.isArray(a.category) && a.category[2] ? a.category[2] : '';
      const bSub = Array.isArray(b.category) && b.category[2] ? b.category[2] : '';
      return aSub.localeCompare(bSub);
    },
  },
  {
    title: 'Type',
    dataIndex: 'category',
    render: (catArr) => Array.isArray(catArr) && catArr[1] ? catArr[1].charAt(0).toUpperCase() + catArr[1].slice(1) : '',
    sorter: (a, b) => {
      const aType = Array.isArray(a.category) && a.category[1] ? a.category[1] : '';
      const bType = Array.isArray(b.category) && b.category[1] ? b.category[1] : '';
      return aType.localeCompare(bType);
    },
  },
  {
    title: 'Ordered Items',
    dataIndex: 'ordered',
    sorter: (a, b) => (a.ordered || 0) - (b.ordered || 0),
  },
  {
    title: 'Revenue',
    dataIndex: 'revenue',
    sorter: (a, b) => (a.revenue || 0) - (b.revenue || 0),
  },
  {
    title: 'Catalog...',
    dataIndex: 'catalog',
    render: (status) => <CatalogStatus status={status} />, // You may want to map your Firestore field
  },
  {
    title: 'Stock status',
    dataIndex: 'inStock',
    render: (inStock) => <StockStatus status={inStock ? 'In stock' : 'Out of stock'} />,
  },
  {
    title: '',
    key: 'actions',
    render: () => <Actions />,
  },
];

const ProductCatalogTable = ({ products }) => {
  // Map Firestore product fields to table fields
  const data = (products || []).map((p, idx) => ({
    key: p.id || idx,
    name: p.name,
    category: p.category,
    ordered: p.ordered || 0,
    revenue: p.revenue || 0,
    catalog: p.catalog || 'Active',
    inStock: p.inStock,
  }));

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowSelection={{ type: 'checkbox' }}
      pagination={false}
      bordered
      style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
    />
  );
};

export default ProductCatalogTable; 