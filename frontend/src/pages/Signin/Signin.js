import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import style from "./style.module.css";
import { request } from '../../utils/request';
import { getUser, saveUser } from '../../utils/storage';

export default function LoginForm(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  const onFinish = async (values) => {
    console.log('Received values of form: ', values);
    let res = await request(
      '/api/signin',
      {
        email: email,
        password: password,
      },
      'post',
    )
    if (res) {
      saveUser(res);
      message.success("Signin success");
      if(res.type===3){
        window.location.href = "/admin/home";
      }else{
        window.location.href = "/";
      }
      
    }

  };
  return (
    <div className={style.container}>
      <Form
        name="normal_login"
        className={style.siginWrapper}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <div className={style.caption}>Sign in</div>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input
            type="text"
            autoComplete='false'
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Signin
          </Button>
          <span style={{ margin: '0 8px' }}>Or</span>
          <Link to="/signup">Signup now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
}

LoginForm.propTypes = {
  login: PropTypes.func,
};
