import React, { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button, InputNumber, Checkbox, Row, Col, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { getAllCategoriesFlat } from '../services/databaseFunctions';
import { useRef } from 'react';

const { Option } = Select;

const typeOptions = ['Casual', 'Gym', 'Party', 'Formal'];
const categoryOptions = ['Men', 'Women', 'Kids'];
const sectionOptions = ['Top', 'Bottom'];

const AddProductModal = ({ visible, onCancel, onAdd, product, isEditMode }) => {
  const [form] = Form.useForm();
  const [thumbnailList, setThumbnailList] = useState([]);
  const [image1List, setImage1List] = useState([]);
  const [image2List, setImage2List] = useState([]);
  const [discountFlag, setDiscountFlag] = useState(false);
  const [categories, setCategories] = useState([]);
  const [rootOptions, setRootOptions] = useState([]);
  const [childOptions, setChildOptions] = useState([]);
  const [grandchildOptions, setGrandchildOptions] = useState([]);
  const [selectedRoot, setSelectedRoot] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      const cats = await getAllCategoriesFlat();
      setCategories(cats);
      setRootOptions(cats.filter(cat => !cat.parentID));
    }
    fetchCategories();
  }, []);

  // Add a new useEffect to handle edit mode value/option setup after categories are loaded
  useEffect(() => {
    if (isEditMode && product && visible && categories.length > 0) {
      // Ensure current category is in rootOptions
      let rootOpts = categories.filter(cat => !cat.parentID);
      if (product.category && !rootOpts.some(cat => cat.id === product.category)) {
        rootOpts = [
          ...rootOpts,
          { id: product.category, name: product.categoryName || 'Current Category' }
        ];
      }
      setRootOptions(rootOpts);
      // Ensure current type is in childOptions
      let childOpts = categories.filter(cat => cat.parentID === product.category);
      if (product.type && !childOpts.some(cat => cat.id === product.type)) {
        childOpts = [
          ...childOpts,
          { id: product.type, name: product.styleName || 'Current Type', parentID: product.category }
        ];
      }
      setChildOptions(childOpts);
      // Ensure current section is in grandchildOptions
      let grandchildOpts = categories.filter(cat => cat.parentID === product.type);
      if (product.section && !grandchildOpts.some(cat => cat.id === product.section)) {
        grandchildOpts = [
          ...grandchildOpts,
          { id: product.section, name: product.typeName || 'Current Section', parentID: product.type }
        ];
      }
      setGrandchildOptions(grandchildOpts);
      setSelectedRoot(product.category || null);
      setSelectedChild(product.type || null);
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        discountPercentage: product.discountPercentage,
        rootCategory: product.category,
        childCategory: product.type,
        grandchildCategory: product.section,
        inStock: typeof product.inStock === 'boolean' ? product.inStock : true,
        state: typeof product.state === 'boolean' ? product.state : true,
      });
      setDiscountFlag(!!product.discountFlag);
      setThumbnailList(product.thumbnail ? [{
        uid: '-1',
        name: 'thumbnail',
        status: 'done',
        url: product.thumbnail,
      }] : []);
      setImage1List(product.image1 ? [{
        uid: '-2',
        name: 'image1',
        status: 'done',
        url: product.image1,
      }] : []);
      setImage2List(product.image2 ? [{
        uid: '-3',
        name: 'image2',
        status: 'done',
        url: product.image2,
      }] : []);
    } else if (!visible) {
      form.resetFields();
      setThumbnailList([]);
      setImage1List([]);
      setImage2List([]);
      setDiscountFlag(false);
      setSelectedRoot(null);
      setSelectedChild(null);
      setChildOptions([]);
      setGrandchildOptions([]);
    }
  }, [isEditMode, product, visible, categories, form]);

  // Add this effect to set default checkbox values in add mode
  useEffect(() => {
    if (!isEditMode && visible) {
      form.setFieldsValue({
        inStock: true,
        state: true,
      });
    }
  }, [isEditMode, visible, form]);

  const handleRootChange = (val) => {
    setSelectedRoot(val);
    setSelectedChild(null);
    setGrandchildOptions([]);
    setChildOptions(categories.filter(cat => cat.parentID === val));
    form.setFieldsValue({ category: undefined, childCategory: undefined, grandchildCategory: undefined });
  };
  const handleChildChange = (val) => {
    setSelectedChild(val);
    setGrandchildOptions(categories.filter(cat => cat.parentID === val));
    form.setFieldsValue({ grandchildCategory: undefined });
  };

  const handleOk = () => {
    if (!isEditMode) {
      // Add mode: require images
      if (!thumbnailList[0] || !thumbnailList[0].originFileObj || !image1List[0] || !image1List[0].originFileObj || !image2List[0] || !image2List[0].originFileObj) {
        message.error('Please upload all three images (thumbnail, image 1, image 2) before adding the product.');
        return;
      }
    }
    form.validateFields().then(values => {
      // Only pass raw form values and context to onAdd
      const payload = {
        ...values,
        discountFlag,
        // Only add images in add mode
        ...(isEditMode ? {} : {
          thumbnail: thumbnailList[0],
          image1: image1List[0],
          image2: image2List[0],
        })
      };
      onAdd(payload);
      form.resetFields();
      setThumbnailList([]);
      setImage1List([]);
      setImage2List([]);
      setDiscountFlag(false);
      setSelectedRoot(null);
      setSelectedChild(null);
      setChildOptions([]);
      setGrandchildOptions([]);
    });
  };

  const safeCancel = () => {
    try {
      form.resetFields();
    } catch (e) {}
    setThumbnailList([]);
    setImage1List([]);
    setImage2List([]);
    setDiscountFlag(false);
    setSelectedRoot(null);
    setSelectedChild(null);
    setChildOptions([]);
    setGrandchildOptions([]);
    onCancel();
  };

  return (
    <Modal
      title={isEditMode ? 'Edit Product' : 'Add Product'}
      open={visible}
      onCancel={safeCancel}
      footer={[
        <Button
          key="cancel"
          onClick={safeCancel}
          style={{
            background: '#f5f5f5',
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
          key={isEditMode ? 'edit' : 'add'}
          type="primary"
          onClick={handleOk}
          style={{ background: '#111', color: '#fff', border: 'none', fontWeight: 500 }}
          onMouseOver={e => e.currentTarget.style.background = '#888'}
          onMouseOut={e => e.currentTarget.style.background = '#111'}
        >
          {isEditMode ? 'Update' : 'Add'}
        </Button>
      ]}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please enter product name' }]}> 
          <Input placeholder="Enter product name" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter a description' }]}> 
          <Input.TextArea placeholder="Enter product description" rows={3} />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter a price' }]}> 
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter price" />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}> 
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter quantity" />
        </Form.Item>
        <Form.Item label="Discount?" style={{ marginBottom: 15 }}>
          <Row align="middle" gutter={8}>
            <Col>
              <Checkbox checked={discountFlag} onChange={e => setDiscountFlag(e.target.checked)}>Discount</Checkbox>
            </Col>
            {discountFlag && (
              <Col>
                <Form.Item
                  name="discountPercentage"
                  noStyle
                  rules={[{ required: true, message: 'Please enter discount percentage' }]}
                >
                  <InputNumber min={0} max={100} style={{ width: 120 }} placeholder="%" />
                </Form.Item>
              </Col>
            )}
          </Row>
        </Form.Item>
        {/* Remove headings for In Stock and Visible on Site, keep only the checkboxes */}
        <Form.Item name="inStock" valuePropName="checked">
          <Checkbox>In Stock</Checkbox>
        </Form.Item>
        <Form.Item name="state" valuePropName="checked">
          <Checkbox>Visible on Site</Checkbox>
        </Form.Item>
        {isEditMode ? (
          <Form.Item label="Category Path">
            <div style={{ padding: '8px 12px', background: '#fafafa', borderRadius: 4, border: '1px solid #eee', color: '#333' }}>
              {[
                product?.categoryName,
                product?.styleName,
                product?.typeName
              ].filter(Boolean).join(' > ') || 'N/A'}
            </div>
          </Form.Item>
        ) : (
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="rootCategory" label="Category" rules={[{ required: true, message: 'Please select a root category' }]}> 
                <Select placeholder="Select root category" onChange={handleRootChange} value={selectedRoot} allowClear>
                  {rootOptions.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              {childOptions.length > 0 && (
                <Form.Item name="childCategory" label="Style" rules={[{ required: false }]}> 
                  <Select placeholder="Select style" onChange={handleChildChange} value={selectedChild} allowClear>
                    {childOptions.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
                  </Select>
                </Form.Item>
              )}
            </Col>
            <Col span={8}>
              {grandchildOptions.length > 0 && (
                <Form.Item name="grandchildCategory" label="type" rules={[{ required: false }]}> 
                  <Select placeholder="Select sub-subcategory" allowClear>
                    {grandchildOptions.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>
        )}
        {!isEditMode && (
          <>
            <Form.Item name="thumbnail" label="Thumbnail Image" rules={[{ required: true, message: 'Please upload a thumbnail image' }]}> 
              <Upload
                beforeUpload={() => false}
                fileList={Array.isArray(thumbnailList) ? thumbnailList : []}
                onChange={({ fileList }) => setThumbnailList(Array.isArray(fileList) ? fileList : [])}
                maxCount={1}
                accept="image/*"
                showUploadList={{ showRemoveIcon: !isEditMode }}
              >
                <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="image1" label="Image 1" rules={[{ required: true, message: 'Please upload image 1' }]}> 
              <Upload
                beforeUpload={() => false}
                fileList={Array.isArray(image1List) ? image1List : []}
                onChange={({ fileList }) => setImage1List(Array.isArray(fileList) ? fileList : [])}
                maxCount={1}
                accept="image/*"
                showUploadList={{ showRemoveIcon: !isEditMode }}
              >
                <Button icon={<UploadOutlined />}>Upload Image 1</Button>
              </Upload>
            </Form.Item>
            <Form.Item name="image2" label="Image 2" rules={[{ required: true, message: 'Please upload image 2' }]}> 
              <Upload
                beforeUpload={() => false}
                fileList={Array.isArray(image2List) ? image2List : []}
                onChange={({ fileList }) => setImage2List(Array.isArray(fileList) ? fileList : [])}
                maxCount={1}
                accept="image/*"
                showUploadList={{ showRemoveIcon: !isEditMode }}
              >
                <Button icon={<UploadOutlined />}>Upload Image 2</Button>
              </Upload>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AddProductModal; 