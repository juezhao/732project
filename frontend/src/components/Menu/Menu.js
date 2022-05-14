// components/layout.js
import React from 'react';
import styles from "./index.module.css"
import { clear, getUser } from "../../utils/storage";
import menus from "../../config/menus";
import { Link } from 'react-router-dom';
export default function Layout() {

  const user = null

  return (

    <div className={styles.menu}>
      {
        menus.map((item, i) =>
          <Link to={item.path} key={i}>
            <div className={`${styles.menuItem} ${item.children && item.children.length > 0 ? styles.arrowDown : ""}`} >
              <div className={`${styles.menuItemName}`}>{item.name}</div>
              {item.children && item.children.length > 0 ?
                <div className={styles.menuChildren}>
                  {item.children.map((it, j) =>
                    <a href={it.path} target="new" key={j}>
                      <div key={j} className={`${styles.menuChildrenItem}`}>
                        {it.name}
                      </div></a>)}
                </div> : ""}
            </div>
          </Link>
        )
      }
    </div>

  )

}