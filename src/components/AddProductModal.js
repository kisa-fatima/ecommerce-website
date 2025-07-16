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

const AddProductModal = ({ visible, onCancel, onAdd }) => {
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
    // Check for valid image files
    if (!thumbnailList[0] || !thumbnailList[0].originFileObj || !image1List[0] || !image1List[0].originFileObj || !image2List[0] || !image2List[0].originFileObj) {
      message.error('Please upload all three images (thumbnail, image 1, image 2) before adding the product.');
      return;
    }
    form.validateFields().then(values => {
      let categoryId = values.rootCategory;
      let typeId = values.childCategory ? values.childCategory : undefined;
      let sectionId = values.grandchildCategory ? values.grandchildCategory : undefined;
      onAdd({
        ...values,
        category: categoryId,
        ...(typeId && { type: typeId }),
        ...(sectionId && { section: sectionId }),
        discountFlag,
        thumbnail: thumbnailList[0],
        image1: image1List[0],
        image2: image2List[0],
      });
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
      title="Add Product"
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
          key="add"
          type="primary"
          onClick={handleOk}
          style={{ background: '#111', color: '#fff', border: 'none', fontWeight: 500 }}
          onMouseOver={e => e.currentTarget.style.background = '#888'}
          onMouseOut={e => e.currentTarget.style.background = '#111'}
        >
          Add
        </Button>
      ]}
      destroyOnClose
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
        <Form.Item name="thumbnail" label="Thumbnail Image" rules={[{ required: true, message: 'Please upload a thumbnail image' }]}> 
          <Upload
            beforeUpload={() => false}
            fileList={Array.isArray(thumbnailList) ? thumbnailList : []}
            onChange={({ fileList }) => setThumbnailList(Array.isArray(fileList) ? fileList : [])}
            maxCount={1}
            accept="image/*"
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
          >
            <Button icon={<UploadOutlined />}>Upload Image 2</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal; 