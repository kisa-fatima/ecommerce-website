import React, { useState } from 'react';
import { Table, Tag, Tooltip, Button, Modal, Descriptions, Image, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import AddProductModal from './AddProductModal';
import { getCategoryPathById, getAllProducts } from '../services/databaseFunctions';
import { storage } from '../firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import db from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [categoryPath, setCategoryPath] = React.useState('');
  const [typeName, setTypeName] = React.useState('');
  const [sectionName, setSectionName] = React.useState('');
  React.useEffect(() => {
    async function fetchPath() {
      if (product?.category) {
        const pathArr = await getCategoryPathById(product.category);
        setCategoryPath(pathArr.join(' > '));
      } else {
        setCategoryPath('');
      }
      // Resolve type name
      if (product?.type) {
        const typeArr = await getCategoryPathById(product.type);
        setTypeName(typeArr[typeArr.length - 1] || '');
      } else {
        setTypeName('');
      }
      // Resolve section name
      if (product?.section) {
        const sectionArr = await getCategoryPathById(product.section);
        setSectionName(sectionArr[sectionArr.length - 1] || '');
      } else {
        setSectionName('');
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
          <Descriptions.Item label="Category">{categoryPath}</Descriptions.Item>
          <Descriptions.Item label="Type">{typeName}</Descriptions.Item>
          <Descriptions.Item label="Section">{sectionName}</Descriptions.Item>
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

  const handleAdd = async (product) => {
    console.log('Product received from AddProductModal:', product);
    setModalOpen(false);
    message.loading({ content: 'Adding product...', key: 'addProduct' });
    try {
      // 1. Upload images to Firebase Storage
      const uploadImage = async (file, path) => {
        if (!file || !file.originFileObj) return '';
        const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file.originFileObj);
        return await getDownloadURL(storageRef);
      };
      const thumbnailUrl = await uploadImage(product.thumbnail, 'product-thumbnails');
      const image1Url = await uploadImage(product.image1, 'product-images');
      const image2Url = await uploadImage(product.image2, 'product-images');
      // 2. Resolve category/type/section names
      let categoryName = '', typeName = '', sectionName = '';
      if (product.category) {
        const arr = await getCategoryPathById(product.category);
        categoryName = arr[arr.length - 1] || '';
      }
      if (product.type) {
        const arr = await getCategoryPathById(product.type);
        typeName = arr[arr.length - 1] || '';
      }
      if (product.section) {
        const arr = await getCategoryPathById(product.section);
        sectionName = arr[arr.length - 1] || '';
      }
      // 3. Add product to Firestore with only the specified fields
      const productData = {
        category: product.category,
        categoryName,
        description: product.description,
        discountFlag: product.discountFlag,
        discountPercentage: product.discountPercentage,
        image1: image1Url || '',
        image2: image2Url || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        rating: (Math.random() * 2 + 3).toFixed(1), // random between 3.0 and 5.0
        sectionName,
        soldCount: 0,
        state: true,
        thumbnail: thumbnailUrl || '',
        typeName,
      };
      await addDoc(collection(db, 'products'), productData);
      message.success({ content: 'Product added successfully!', key: 'addProduct', duration: 2 });
    } catch (err) {
      console.error('Error adding product:', err);
      message.error({ content: 'Failed to add product. Please try again.', key: 'addProduct', duration: 3 });
    }
    // 4. Refetch products after add
    const products = await getAllProducts();
    // For each product, resolve category path (category > style > type)
    const dataWithHierarchy = await Promise.all(products.map(async (product) => {
      let categoryName = '', styleName = '', typeName = '';
      if (product.category) {
        const pathArr = await getCategoryPathById(product.category);
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
        stock: product.inStock ? 'In stock' : 'Out of stock',
        thumbnail: product.thumbnail,
        image1: product.image1,
        image2: product.image2,
      };
    }));
    setData(dataWithHierarchy);
  };

  const handleEdit = (product) => {
    setProductToEdit(product);
    setEditModalOpen(true);
  };

  const handleUpdate = async (updatedProduct) => {
    setEditModalOpen(false);
    message.loading({ content: 'Updating product...', key: 'updateProduct' });
    try {
      // Upload new images if changed, otherwise keep existing URLs
      const uploadImage = async (file, path, existingUrl) => {
        if (!file) return existingUrl || '';
        if (file.originFileObj) {
          const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file.originFileObj);
          return await getDownloadURL(storageRef);
        }
        return file.url || file.thumbUrl || existingUrl || '';
      };
      const thumbnailUrl = await uploadImage(updatedProduct.thumbnail, 'product-thumbnails', productToEdit.thumbnail);
      const image1Url = await uploadImage(updatedProduct.image1, 'product-images', productToEdit.image1);
      const image2Url = await uploadImage(updatedProduct.image2, 'product-images', productToEdit.image2);
      // Resolve category/style/type names
      let categoryName = '', styleName = '', typeName = '';
      if (updatedProduct.category) {
        const arr = await getCategoryPathById(updatedProduct.category);
        categoryName = arr[0] || '';
        styleName = arr[1] || '';
        typeName = arr[2] || '';
      }
      // Update product in Firestore
      const docRef = doc(db, 'products', productToEdit.key || productToEdit.id);
      await updateDoc(docRef, {
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        quantity: updatedProduct.quantity,
        discountFlag: updatedProduct.discountFlag,
        discountPercentage: updatedProduct.discountPercentage,
        category: updatedProduct.category,
        type: updatedProduct.type,
        section: updatedProduct.section,
        categoryName,
        styleName,
        typeName,
        thumbnail: thumbnailUrl,
        image1: image1Url,
        image2: image2Url,
        inStock: updatedProduct.inStock !== undefined ? updatedProduct.inStock : true,
      });
      message.success({ content: 'Product updated successfully!', key: 'updateProduct', duration: 2 });
    } catch (err) {
      console.error('Error updating product:', err);
      message.error({ content: 'Failed to update product. Please try again.', key: 'updateProduct', duration: 3 });
    }
    // Refetch products after update
    const products = await getAllProducts();
    const dataWithHierarchy = await Promise.all(products.map(async (product) => {
      let categoryName = '', styleName = '', typeName = '';
      if (product.category) {
        const pathArr = await getCategoryPathById(product.category);
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
        stock: product.inStock ? 'In stock' : 'Out of stock',
        thumbnail: product.thumbnail,
        image1: product.image1,
        image2: product.image2,
      };
    }));
    setData(dataWithHierarchy);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleDelete = (product) => {
    setData(data.filter((item) => item.key !== product.key));
  };

  // Fetch products from Firestore on mount and resolve category hierarchy
  React.useEffect(() => {
    async function fetchProducts() {
      const products = await getAllProducts();
      // For each product, resolve category path (category > style > type)
      const dataWithHierarchy = await Promise.all(products.map(async (product) => {
        let categoryName = '', styleName = '', typeName = '';
        if (product.category) {
          const pathArr = await getCategoryPathById(product.category);
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
          stock: product.inStock ? 'In stock' : 'Out of stock',
          thumbnail: product.thumbnail,
          image1: product.image1,
          image2: product.image2,
        };
      }));
      setData(dataWithHierarchy);
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
      />
      <AddProductModal visible={modalOpen} onCancel={() => setModalOpen(false)} onAdd={handleAdd} />
      <AddProductModal visible={editModalOpen} onCancel={() => setEditModalOpen(false)} onAdd={handleUpdate} product={productToEdit} isEditMode />
      <ProductViewModal visible={viewModalOpen} onClose={() => setViewModalOpen(false)} product={selectedProduct} />
    </div>
  );
};

export default ProductCatalogTable;