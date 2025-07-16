import React, { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button, InputNumber, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

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

  const handleOk = () => {
    form.validateFields().then(values => {
      onAdd({
        ...values,
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
    onCancel();
  };

  return (
    <Modal
      title="Add Product"
      open={visible}
      onCancel={safeCancel}
      onOk={handleOk}
      okText="Add"
      cancelText="Cancel"
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
        <Form.Item label="Discount?" valuePropName="checked">
          <Checkbox checked={discountFlag} onChange={e => setDiscountFlag(e.target.checked)}>Discount</Checkbox>
        </Form.Item>
        {discountFlag && (
          <Form.Item name="discountPercentage" label="Discount Percentage" rules={[{ required: true, message: 'Please enter discount percentage' }]}> 
            <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="Enter discount percentage" />
          </Form.Item>
        )}
        <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select category' }]}> 
          <Select placeholder="Select category">
            {categoryOptions.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Please select type' }]}> 
          <Select placeholder="Select type">
            {typeOptions.map(type => <Option key={type} value={type}>{type}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="section" label="Section" rules={[{ required: true, message: 'Please select section' }]}> 
          <Select placeholder="Select section">
            {sectionOptions.map(section => <Option key={section} value={section}>{section}</Option>)}
          </Select>
        </Form.Item>
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