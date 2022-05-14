import React, { useState } from 'react';
import { Form, Input, Button, message, Radio, Checkbox, Upload } from 'antd';
import { PlusOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import style from "./style.module.css";
import { request } from '../../utils/request';
import { getUser } from '../../utils/storage';
const { TextArea } = Input;

export default function Signup(props) {
  const [price, setPrice] = useState('');
  const [remark, setRemark] = useState('');
  const [name, setName] = useState('');
  const [fileList, setFileList] = useState([

  ]);

  const navigate = useNavigate();
  let user = getUser();

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    if(fileList.length===0){
      message.error("please upload image");
      return;
    }

    let res = await request(
      '/api/food/save',
      {
        remark: remark,
        images: fileList.map((item)=>item.response).join(","),
        price: price,
        name: name,
        owner:user.id,
        ownerName:user.name
      },
      'post',
    )
    if (res) {
      message.success("Signup success");
      navigate("/profile");
    }

  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = ({ fileList }) => {
    console.log("fileList", fileList)
    setFileList([...fileList]);
  };

  return (
    <div className={style.container}>


      <Form
        name="normal_register"
        className={style.signupWrapper}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <div className={style.caption}> Upload Food</div>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
        >
          <Input
            type="text"
            placeholder="Name"
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Image"
          rules={[
            {
              required: true,
              message: 'Please input your images!',
            },
          ]}
        >

          <Upload
            action="http://localhost:32326/uploadfile"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>

          <br />
        </Form.Item>
        <Form.Item
          label="price"
          name="price"

          rules={[
            {
              required: true,
              message: 'Please input your price!',
            },
          ]}
        >
          <Input
            type="number"
            onChange={(event) => setPrice(event.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="remark"
          name="remark"
          rules={[
            {
              required: true,
              message: 'Please input your remark!',
            },
          ]}
        >
          <TextArea
            prefix={<SmileOutlined className="site-form-item-icon" />}
            rows={8}
            type="textArea"
            onChange={(event) => setRemark(event.target.value)}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 10, textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="register-form-button"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

