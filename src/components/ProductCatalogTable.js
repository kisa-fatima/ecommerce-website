import React, { useState } from 'react';
import { Table, Tag, Tooltip, Button, Modal, Descriptions, Image } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import AddProductModal from './AddProductModal';

const initialData = [];

const CatalogStatus = ({ status }) => {
  let color = 'green';
  if (status === 'Deleted') color = 'red';
  else if (status === 'Inactive' || status === 'Out of stock') color = 'gray';
  return <Tag color={color}>{status}</Tag>;
};

const StockStatus = ({ status }) => (
  <span style={{ color: status === 'In stock' ? '#52c41a' : '#888' }}>{status}</span>
);

const ProductViewModal = ({ visible, onClose, product }) => (
  <Modal open={visible} onCancel={onClose} onOk={onClose} title="Product Details" footer={null}>
    {product ? (
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Product Name">{product.name}</Descriptions.Item>
        <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
        <Descriptions.Item label="Price">{product.price}</Descriptions.Item>
        <Descriptions.Item label="Quantity">{product.quantity}</Descriptions.Item>
        <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
        <Descriptions.Item label="Type">{product.type}</Descriptions.Item>
        <Descriptions.Item label="Section">{product.section}</Descriptions.Item>
        <Descriptions.Item label="Discount?">{product.discountFlag ? 'Yes' : 'No'}</Descriptions.Item>
        {product.discountFlag && (
          <Descriptions.Item label="Discount Percentage">{product.discountPercentage}</Descriptions.Item>
        )}
        <Descriptions.Item label="Catalog Status">{product.catalog}</Descriptions.Item>
        <Descriptions.Item label="Stock Status">{product.stock}</Descriptions.Item>
        <Descriptions.Item label="Images">
          <div style={{ display: 'flex', gap: 8 }}>
            {product.thumbnail && <Image width={60} src={product.thumbnail.thumbUrl || product.thumbnail.url} alt="Thumbnail" />}
            {product.image1 && <Image width={60} src={product.image1.thumbUrl || product.image1.url} alt="Image 1" />}
            {product.image2 && <Image width={60} src={product.image2.thumbUrl || product.image2.url} alt="Image 2" />}
          </div>
        </Descriptions.Item>
      </Descriptions>
    ) : null}
  </Modal>
);

const Actions = ({ onView, onEdit, onDelete }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    <Tooltip title="View"><Button icon={<EyeOutlined />} size="small" onClick={onView} /></Tooltip>
    <Tooltip title="Edit"><Button icon={<EditOutlined />} size="small" onClick={onEdit} /></Tooltip>
    <Tooltip title="Delete"><Button icon={<DeleteOutlined />} size="small" danger onClick={onDelete} /></Tooltip>
  </div>
);

const columns = (onView, onEdit, onDelete) => [
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
    title: 'Section',
    dataIndex: 'section',
    sorter: (a, b) => a.section.localeCompare(b.section),
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
    render: (_, record, idx) => <Actions onView={() => onView(record)} onEdit={() => onEdit(record, idx)} onDelete={() => onDelete(record, idx)} />,
  },
];

const ProductCatalogTable = () => {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAdd = (product) => {
    setData([
      ...data,
      {
        key: Date.now(),
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        discountFlag: product.discountFlag,
        discountPercentage: product.discountPercentage,
        category: product.category,
        type: product.type,
        section: product.section,
        ordered: 0,
        revenue: 0,
        catalog: 'Active',
        stock: 'In stock',
        thumbnail: product.thumbnail,
        image1: product.image1,
        image2: product.image2,
      },
    ]);
    setModalOpen(false);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleEdit = () => {
    // TODO: Implement edit logic
  };

  const handleDelete = (product) => {
    setData(data.filter((item) => item.key !== product.key));
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
        columns={columns(handleView, handleEdit, handleDelete)}
        dataSource={data}
        rowSelection={{ type: 'checkbox' }}
        pagination={false}
        bordered
        style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
      />
      <AddProductModal visible={modalOpen} onCancel={() => setModalOpen(false)} onAdd={handleAdd} />
      <ProductViewModal visible={viewModalOpen} onClose={() => setViewModalOpen(false)} product={selectedProduct} />
    </div>
  );
};

export default ProductCatalogTable;