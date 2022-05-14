
import { Dropdown, Input, Menu, Rate, Space } from "antd";
import { useEffect, useState } from "react";
import { request } from "../../utils/request";
import { Link, useNavigate } from "react-router-dom";
import { SmileOutlined, DownOutlined } from '@ant-design/icons';
import { Pagination, Select } from 'antd';
import styles from "./style.module.css";
import { getUser } from "../../utils/storage";

export default function Home() {
  const navigate = useNavigate();


  const [showJoin, setShowJoin] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState({});

  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [list, setList] = useState([

  ]);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1
  };


  useEffect(() => {
    console.log("id,")

    console.log("useEffect");
    let user = getUser();
    if (!user) {
      navigate("/signin");
    }


    request("/api/getAllRooms", {
      id: roomId
    }).then(res => {
      setRooms(res);
    })

  }, [])

  const createRoom = () => {
    let user = getUser();
    request("/api/createRoom", user).then(res => {
      navigate("/room/" + res.id);
    })
  }

  const joinRoom = () => {
    let user = getUser();
    request("/api/joinRoom", {
      roomId: roomId,
      user: user
    }).then(res => {
      navigate("/room/" + roomId);
    })
  }

  const loadData = (page, pageSize) => {
    setPageSize(pageSize);
    setCurrent(page);
    request("/api/queryRestaurant?current=" + page + "&size=" + pageSize, {

    }).then(res => {
      setList(res.list);
      setTotal(res.total);

      console.log("pets", res, "get");
    })
  }


  return <div className={styles.home}>
    <div className={styles.top}>


    </div>
    <div className={styles.content}>
      <div className={styles.filters}>
        <div className={styles.itemFilters}>
          <div className={styles.itemFilterTop}>
            <div className={styles.itemFilterTopFont}>Has {Object.keys(rooms).length} Room</div>
            <div className={styles.itemFilterTopButton}> Welcome meeting</div>
            {
              Object.keys(rooms).map((key, i) => {
                let room = rooms[key];
                return <div key={room.id} style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", flex: 1,flexDirection:"column", justifyContent: "space-between", padding: "0px 10px 10px 0px",borderBottom:"1px solid #eee" }}>
                      <span style={{marginLeft:10,marginBottom:10}}>{room.id}</span>
                      {
                        room.users && room.users.length ?
                          <div>
                            <img style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10, marginRight: 10 }} src={'http://localhost:32326/file?id=' + room.users[0].avatar} alt=""></img>
                            <span style={{ color: "#333" }}>{room.users[0].name}</span>
                            <span style={{ color: "#5454ff" ,marginLeft:20}}>owner</span>
                          </div> : ""
                      }

                    </div>
                  </div>

                </div>
              })
            }
          </div>
        </div>

      </div>

      <div className={styles.rightContent}>
        {!showJoin ? <div className={styles.rightContentWrapper}>
          <div className={styles.rightContentWrapperCaption}>
            <img style={{ width: 30, height: 30, marginRight: 10 }} src="/images/logo.png" alt=""></img>
            <span style={{ fontWeight: "bold" }}>Cool Video Meeting</span>
          </div>
          <div className={styles.joinRoom} onClick={() => {
            setShowJoin(true);
          }}>
            Join Room
          </div>
          <div className={styles.createRoom} onClick={() => {
            createRoom();
          }}>
            Create Room
          </div>
        </div>
          : <div className={styles.joinContent}>
            <div className={styles.joinCaption} style={{ textAlign: "left", fontSize: "16px", fontWeight: "bold" }}>
              加入会议
            </div>
            <Input value={roomId} style={{ margin: 10, width: 250, borderRadius: 5, marginTop: 30 }} onChange={(e) => {
              setRoomId(e.target.value);
            }}></Input>
            <div style={{ display: "flex", flexDirection: "row", marginTop: 30 }}>
              <div className={styles.joinButton} onClick={() => {
                joinRoom()
              }}>
                加入
              </div>
              <div className={styles.cancelButton} onClick={() => {
                setShowJoin(false);
              }}>
                取消
              </div>
            </div>
          </div>}
      </div>
    </div>
  </div>
}

