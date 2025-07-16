import React, { useState } from 'react';
import { Modal, Form, Input, Select, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const typeOptions = ['Casual', 'Gym', 'Party', 'Formal'];
const categoryOptions = ['Men', 'Women', 'Kids'];

const AddProductModal = ({ visible, onCancel, onAdd }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleOk = () => {
    form.validateFields().then(values => {
      onAdd({ ...values, image: fileList[0] });
      form.resetFields();
      setFileList([]);
    });
  };

  return (
    <Modal
      title="Add Product"
      open={visible}
      onCancel={() => { form.resetFields(); setFileList([]); onCancel(); }}
      onOk={handleOk}
      okText="Add"
      cancelText="Cancel"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Product Name" rules={[{ required: true, message: 'Please enter product name' }]}> 
          <Input placeholder="Enter product name" />
        </Form.Item>
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
        <Form.Item name="image" label="Product Image" rules={[{ required: true, message: 'Please upload an image' }]}> 
          <Upload
            beforeUpload={() => false}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal; 