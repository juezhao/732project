// components/layout.js
import React from 'react';
import styles from "./index.module.css"
import { clear, getUser } from "../../utils/storage";
import Menu from "../Menu/Menu";
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'antd';

import { LogoutOutlined } from '@ant-design/icons';

export default function Layout() {

  const user = getUser();
  console.log("user1111",user)
  if (user) {

  }
  const navagate = useNavigate();

  return (
    <div className={styles.header}>
      <Link to="/">
        <div className={styles.caption} style={{ cursor: "pointer" }}>
          <img alt='' src='/images/logo.png' className={styles.logo}></img>
          <span className={styles.appName}>Cool WebRTC</span>
        </div>
      </Link>
      <div className={styles.menus}>
        <Menu></Menu>
      </div>
      {
        user ? <div className={styles.right}>
          <div >
            <img className={styles.headimg} src={'http://localhost:32326/file?id='+user.avatar} alt=''  onClick={() => { 
              navagate("/profile")
            }}></img>
            <span style={{ marginLeft: 5, color: "#000", cursor: "pointer" }} onClick={() => { 
              navagate("/profile")
            }}>
              {user.name}
            </span>
            <Tooltip title="logout">
              <LogoutOutlined onClick={() => {
                console.log("logout");
                clear();
                window.location.href="/"
              }} style={{ color: "#000", marginLeft: "10px" }} />
            </Tooltip>
          </div>

        </div> :
          <div className={styles.loginBtn} onClick={() => { navagate("/signin"); }}>
            Signin
          </div>
      }

    </div >
  )

}