import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "./style.module.css";
import { Button, Menu, message, Rate, Space, Upload } from 'antd';

import { request } from '../../utils/request';
import { getUser } from '../../utils/storage';

const Profile = (props) => {
  const navigate = useNavigate();

  let user = getUser();

  let userId = useParams().id;

  const otherUser = userId && userId !== user._id;

  if (!userId) {
    userId = user._id;
  }

  const [rates, setRates] = useState([
    {
      value: 5,
      count: 0,
    },
    {
      value: 4,
      count: 0,
    },
    {
      value: 3,
      count: 0,
    },
    {
      value: 2,
      count: 0,
    },
    {
      value: 1,
      count: 0,
    },
    {
      value: 0,
      count: 0,
    },
  ])
  

  useEffect(() => {
    // request(
    //   '/api/users/user/' + userId,
    //   {
    //   },
    //   'get',
    // ).then(res => {
      
    // })


  }, [])


  return (
    <div className={style.container}>
      <div className={style.top}>
        <img alt='' className={style.heading} src={'http://localhost:32326/file?id='+user.avatar || '/images/headimg.jpg'}></img>
        <div className={style.topCenter}>
          <div className={style.row}>
            <div className={style.rowLabel}>
              Name
            </div>
            <div className={style.rowValue}>
              {!user.name ? <span className={style.unknown}>unknown</span> : user.name}
            </div>
          </div>
          <div className={style.row}>
            <div className={style.rowLabel}>
            LivingIn
            </div>
            <div className={style.rowValue}>
              {!user.livingIn ? <span className={style.unknown}>unknown</span> : user.livingIn}
            </div>
          </div>
          <div className={style.row}>
            <div className={style.rowLabel}>
            Signature
            </div>
            <div className={style.rowValue}>
              {!user.signature ? <span className={style.unknown}>unknown</span> : user.signature}
            </div>
          </div>
         

        </div>
        <div className={style.topRight}>
          {otherUser ? <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Button type='primary' onClick={()=>{
              request(
                '/api/followings/' + user._id+"/"+userId,
                {
                },
                'post',
              ).then(res => {
                message.success("add friend success")
              });
            }}>add friend</Button>

            {/* <Button type='primary'  onClick={()=>{
              request(
                '/api/followings/' + user._id+"/"+userId,
                {
                },
                'post',
              ).then(res => {
                message.success("follow success")
              });
            }}>follow he</Button> */}
          </Space> : <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            
{/* 
            <Button type='primary' onClick={() => {
              navigate("/editProfile");
            }}>Edit Profile</Button> */}
          </Space>}

        </div>
      </div>
      


    </div>
  );
};

export default Profile;