import React, { useState } from 'react';
import { Form, Input, Button, message, Radio, Checkbox, Upload } from 'antd';
import { UserOutlined, LockOutlined, SmileOutlined ,PlusOutlined} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import style from "./style.module.css";
import { request } from '../../utils/request';

export default function Signup(props) {
  const [email, setEmail] = useState('');
  const [type, setType] = useState(1);

  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [admin, setAdmin] = useState(false);
  const [fileList, setFileList] = useState([

  ]);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    if (!email) {
      message.error("please input correct email");
      return;
    }
    if (!password) {
      message.error("please input password");
      return;
    }

    if(fileList.length===0){
      message.error("please upload image");
      return;
    }



    let res = await request(
      '/api/signup',
      {
        email: email,
        password: password,
        name: name,
        avatar: fileList.map((item)=>item.response).join(",")
      },
      'post',
    )
    if (res) {
      message.success("Signup success");
      navigate("/signin");
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
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <div className={style.caption}>Sign up</div>
        <Form.Item
          label="Avatar"
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
            maxCount={1}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>

          <br />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              type: "email",
              message: 'Please input your email!',
            },
          ]}
        >
          <Input
            type="text"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="UserEmail"
            onChange={(event) => setEmail(event.target.value)}
          />
          <br />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<SmileOutlined className="site-form-item-icon" />}
            placeholder="Name"
            onChange={(event) => setName(event.target.value)}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 10 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="register-form-button"
          >
            Signup
          </Button>
          <span style={{ margin: '0 8px' }}>Or</span>
          <Link to="/signin">Sigin now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
}

