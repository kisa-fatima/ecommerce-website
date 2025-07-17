import React, { useState } from 'react';
import { Table, Tag, Tooltip, Button, Modal, Descriptions, Image, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import AddProductModal from './AddProductModal';
import { getCategoryPathById, getAllProducts, handleAddProduct, handleUpdateProduct } from '../services/databaseFunctions';
import { storage } from '../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import db from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LoadingOutlined } from '@ant-design/icons';

const CatalogStatus = ({ status }) => {
  let color = 'green';
  if (status === 'Deleted') color = 'red';
  else if (status === 'Inactive' || status === 'Out of stock') color = 'gray';
  return <Tag color={color}>{status}</Tag>;
};

const StockStatus = ({ status }) => (
  <span style={{ color: status === 'In stock' ? '#52c41a' : '#888' }}>{status}</span>
);

const ProductViewModal = ({ visible, onClose, product }) => {
  const [categoryName, setCategoryName] = React.useState('');
  const [styleName, setStyleName] = React.useState('');
  const [typeName, setTypeName] = React.useState('');
  React.useEffect(() => {
    async function fetchPath() {
      if (product) {
        // Use values from product if present, otherwise fetch
        if (product.categoryName || product.styleName || product.typeName) {
          setCategoryName(product.categoryName || '');
          setStyleName(product.styleName || '');
          setTypeName(product.typeName || '');
        } else {
          const catId = product.categoryID || product.category;
          if (catId) {
            const pathArr = await getCategoryPathById(catId);
            setCategoryName(pathArr[0] || '');
            setStyleName(pathArr[1] || '');
            setTypeName(pathArr[2] || '');
          } else {
            setCategoryName('');
            setStyleName('');
            setTypeName('');
          }
        }
      }
    }
    if (visible && product) fetchPath();
  }, [visible, product]);
  return (
    <Modal open={visible} onCancel={onClose} onOk={onClose} title="Product Details" footer={null}>
      {product ? (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Product Name">{product.name}</Descriptions.Item>
          <Descriptions.Item label="Description">{product.description}</Descriptions.Item>
          <Descriptions.Item label="Price">{product.price}</Descriptions.Item>
          <Descriptions.Item label="Quantity">{product.quantity}</Descriptions.Item>
          <Descriptions.Item label="Category">{categoryName}</Descriptions.Item>
          <Descriptions.Item label="Style">{styleName}</Descriptions.Item>
          <Descriptions.Item label="Type">{typeName}</Descriptions.Item>
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
};

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
    dataIndex: 'categoryName',
    sorter: (a, b) => (a.categoryName || '').localeCompare(b.categoryName || ''),
  },
  {
    title: 'Style',
    dataIndex: 'styleName',
    sorter: (a, b) => (a.styleName || '').localeCompare(b.styleName || ''),
  },
  {
    title: 'Type',
    dataIndex: 'typeName',
    sorter: (a, b) => (a.typeName || '').localeCompare(b.typeName || ''),
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    sorter: (a, b) => a.quantity - b.quantity,
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
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryPaths, setCategoryPaths] = useState({});
  const [loading, setLoading] = useState(true);

  const handleAdd = async (product) => {
    console.log('Product received from AddProductModal:', product);
    setModalOpen(false);
    message.loading({ content: 'Adding product...', key: 'addProduct' });
    try {
      setLoading(true);
      await handleAddProduct(product);
      message.success({ content: 'Product added successfully!', key: 'addProduct', duration: 2 });
    } catch (err) {
      console.error('Error adding product:', err);
      message.error({ content: 'Failed to add product. Please try again.', key: 'addProduct', duration: 3 });
    }
    // Refetch products after add
    const products = await getAllProducts();
    const dataWithHierarchy = await Promise.all(products.map(async (product) => {
      // Always use categoryID (deepest) if present, otherwise fallback to category
      const catId = product.categoryID || product.category;
      let categoryName = '', styleName = '', typeName = '';
      if (catId) {
        const pathArr = await getCategoryPathById(catId);
        categoryName = pathArr[0] || '';
        styleName = pathArr[1] || '';
        typeName = pathArr[2] || '';
      }
      return {
        key: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        discountFlag: product.discountFlag,
        discountPercentage: product.discountPercentage,
        category: product.category,
        categoryName,
        styleName,
        typeName,
        type: product.type,
        section: product.section,
        ordered: product.ordered || 0,
        revenue: product.revenue || 0,
        catalog: product.catalog || 'Active',
        stock: product.inStock === true ? 'In stock' : 'Out of stock',
        inStock: typeof product.inStock === 'boolean' ? product.inStock : false,
        state: typeof product.state === 'boolean' ? product.state : false,
        thumbnail: product.thumbnail,
        image1: product.image1,
        image2: product.image2,
      };
    }));
    setData(dataWithHierarchy);
    setLoading(false);
  };

  const handleEdit = (product) => {
    // Always use the latest product data from the table state
    const latestProduct = data.find(row => row.key === product.key || row.key === product.id) || product;
    setProductToEdit(latestProduct);
    setEditModalOpen(true);
  };

  const handleUpdate = async (updatedProduct) => {
    setEditModalOpen(false);
    message.loading({ content: 'Updating product...', key: 'updateProduct' });
    try {
      setLoading(true);
      await handleUpdateProduct(productToEdit.key || productToEdit.id, updatedProduct, productToEdit);
      message.success({ content: 'Product updated successfully!', key: 'updateProduct', duration: 2 });
    } catch (err) {
      console.error('Error updating product:', err);
      message.error({ content: 'Failed to update product. Please try again.', key: 'updateProduct', duration: 3 });
    }
    // Refetch products after update
    const products = await getAllProducts();
    const dataWithHierarchy = await Promise.all(products.map(async (product) => {
      // Always use categoryID (deepest) if present, otherwise fallback to category
      const catId = product.categoryID || product.category;
      let categoryName = '', styleName = '', typeName = '';
      if (catId) {
        const pathArr = await getCategoryPathById(catId);
        categoryName = pathArr[0] || '';
        styleName = pathArr[1] || '';
        typeName = pathArr[2] || '';
      }
      return {
        key: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        discountFlag: product.discountFlag,
        discountPercentage: product.discountPercentage,
        category: product.category,
        categoryName,
        styleName,
        typeName,
        type: product.type,
        section: product.section,
        ordered: product.ordered || 0,
        revenue: product.revenue || 0,
        catalog: product.catalog || 'Active',
        stock: product.inStock === true ? 'In stock' : 'Out of stock',
        inStock: typeof product.inStock === 'boolean' ? product.inStock : false,
        state: typeof product.state === 'boolean' ? product.state : false,
        thumbnail: product.thumbnail,
        image1: product.image1,
        image2: product.image2,
      };
    }));
    setData(dataWithHierarchy);
    setLoading(false);
  };

  const handleView = (product) => {
    // Find the full row object from data (which has categoryName, styleName, typeName)
    const fullProduct = data.find(row => row.key === product.key || row.key === product.id) || product;
    setSelectedProduct(fullProduct);
    setViewModalOpen(true);
  };

  const handleDelete = (product) => {
    setData(data.filter((item) => item.key !== product.key));
  };

  // Fetch products from Firestore on mount and resolve category hierarchy
  React.useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const products = await getAllProducts();
      // For each product, resolve category path (category > style > type)
      const dataWithHierarchy = await Promise.all(products.map(async (product) => {
        // Always use categoryID (deepest) if present, otherwise fallback to category
        const catId = product.categoryID || product.category;
        let categoryName = '', styleName = '', typeName = '';
        if (catId) {
          const pathArr = await getCategoryPathById(catId);
          categoryName = pathArr[0] || '';
          styleName = pathArr[1] || '';
          typeName = pathArr[2] || '';
        }
        return {
          key: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          discountFlag: product.discountFlag,
          discountPercentage: product.discountPercentage,
          category: product.category,
          categoryName,
          styleName,
          typeName,
          type: product.type,
          section: product.section,
          ordered: product.ordered || 0,
          revenue: product.revenue || 0,
          catalog: product.catalog || 'Active',
          stock: product.inStock === true ? 'In stock' : 'Out of stock',
          inStock: typeof product.inStock === 'boolean' ? product.inStock : false,
          state: typeof product.state === 'boolean' ? product.state : false,
          thumbnail: product.thumbnail,
          image1: product.image1,
          image2: product.image2,
        };
      }));
      setData(dataWithHierarchy);
      setLoading(false);
    }
    fetchProducts();
  }, []);

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
        loading={{ spinning: loading, indicator: <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#111' }} spin />} /> }}
    />
      <AddProductModal visible={modalOpen} onCancel={() => setModalOpen(false)} onAdd={handleAdd} />
      <AddProductModal visible={editModalOpen} onCancel={() => setEditModalOpen(false)} onAdd={handleUpdate} product={productToEdit} isEditMode />
      <ProductViewModal visible={viewModalOpen} onClose={() => setViewModalOpen(false)} product={selectedProduct} />
    </div>
  );
};

export default ProductCatalogTable; 