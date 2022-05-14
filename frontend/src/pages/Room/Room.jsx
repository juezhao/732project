
import { Button, Dropdown, Input, Menu, Rate, Space } from "antd";
import { useEffect, useState, useMemo, useRef } from "react";
import { request } from "../../utils/request";
import { Link, useNavigate } from "react-router-dom";
import { SendOutlined } from '@ant-design/icons';
import { Pagination, Select } from 'antd';
import styles from "./style.module.css";
import { getUser } from "../../utils/storage";
import { useParams } from "react-router";
import * as socket from "../../utils/socket";
import { uuid } from "../../utils/utils";
import moment from "moment";
let rtcClient;
let shareClient;
let qipaoTimer;
export default function Room(props) {

  const navigate = useNavigate();
  const params = useParams();

  // const memoizedValue =useMemo(()=>{
  //   console.log("memoizedValue");
  //   },[params.id]);


  console.log("id,", params.id)
  const [showJoin, setShowJoin] = useState(false);
  const [roomId, setRoomId] = useState(params.id);
  const [msgContent, setMsgContent] = useState("");
  const [qipaoMsgContent, setQipaoMsgContent] = useState("");
  const [qipao, setQipao] = useState(null);


  let [closeCamera, setCloseCamera] = useState(false);
  let [closeAudio, setCloseAudio] = useState(false);
  let [closeShareScreen, setCloseShareScreen] = useState(true);




  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [room, setRoom] = useState({
    users: [],
    chats: []
  });
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    arrows: false,
    slidesToScroll: 1
  };

  const join = () => {
    let user = getUser();

    request("/api/getUserSign", {
      id: user.id
    }).then(res => {

      let options = {
        sdkAppId: 1400679119,
        userSig: res.userSign,
        userId: user.id,
        roomId: parseInt(roomId % 1000),
        onlyAudio: false
      };

      // eslint-disable-next-line no-undef
      rtcClient = new RtcClient(options);





      rtcClient.client_.on('stream-subscribed', evt => {
        console.log("stream-subscribed ===============!");
      });
      rtcClient.client_.on('stream-removed', evt => {
        console.log("stream-removed ===============!", evt);
        // if (!this.mineLeave) {
        //   // if(this.rtc.isJoined_){
        //   //   this.rtc.leave();
        //   // }

        //   //this.leave();
        // }

      })
      rtcClient.join();
    })

    request("/api/getUserSign", {
      id: user.id + "_sharescreen"
    }).then(res => {
      let options = {
        sdkAppId: 1400679119,
        userSig: res.userSign,
        userId: user.id + "_sharescreen",
        roomId: parseInt(roomId % 1000),
        onlyAudio: false
      };

      // eslint-disable-next-line no-undef
      shareClient = new ShareClient(options);

    });


  };

  console.log("room", room);

  const refRoom = useRef(room);
  refRoom.current = room;


  useEffect(() => {
    console.log("useEffect");
    join();
    let user = getUser();
    socket.init(roomId, (cmd, content) => {
      console.log("收到消息", cmd, content);
      if (cmd === "chat") {
        console.log("room==", refRoom);
        refRoom.current.chats.push(content);
        refRoom.current.chats = [...refRoom.current.chats];
        console.log("room==", room.chats);
        setRoom({ ...refRoom.current });
        console.log("room==", room);

      } else if (cmd === "qipao") {
        // console.log("room==",refRoom);
        // refRoom.current.chats.push(content);
        // refRoom.current.chats=[...refRoom.current.chats];
        // console.log("room==",room.chats);
        // setRoom({...refRoom.current});
        // console.log("room==",room);
        setQipao(content);
        if(!qipaoTimer){
          window.clearTimeout(qipaoTimer)
        }
        qipaoTimer = setTimeout(() => {
          setQipao(null);
          qipaoTimer = null
        }, 3000);
      }
    })
    if (!user) {
      navigate("/signin");
    }

    request("/api/room/get", {
      id: roomId
    }).then(res => {
      setRoom(res);
    })

  }, [])

  useEffect(() => {
    let div = document.getElementById("chatList");
    div.scrollTop = div.scrollHeight;
  }, [room.chats])



  const sendMsg = () => {
    let user = getUser();
    socket.sendChat({
      id: uuid(),
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
      roomId: roomId,
      sender: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      content: msgContent
    });

    setMsgContent("");

  }

  const sendQipaoMsg = () => {
    let user = getUser();
    socket.sendQipaoChat({
      id: uuid(),
      time: moment().format("YYYY-MM-DD HH:mm:ss"),
      roomId: roomId,
      sender: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      content: qipaoMsgContent
    });
    setQipaoMsgContent("");
  }


  const clickCloseCamera = () => {
    let user = getUser();
    closeCamera = !closeCamera;
    if (closeCamera) {
      rtcClient.muteLocalVideo();
    } else {
      rtcClient.unmuteLocalVideo();
    }
    setCloseCamera(closeCamera);
  }


  const clickCloseAudio = () => {
    let user = getUser();
    closeAudio = !closeAudio;
    if (closeAudio) {
      rtcClient.muteLocalAudio();
    } else {
      rtcClient.unmuteLocalAudio();
    }
    setCloseAudio(closeAudio);
  }


  const clickShareScreen = () => {
    let user = getUser();
    closeShareScreen = !closeShareScreen;
    if (closeShareScreen) {

      shareClient.leave();

    } else {

      shareClient.join();
    }
    setCloseShareScreen(closeShareScreen);
  }
  const leaveRoom = () => {
    let user = getUser();
    request("/api/leaveRoom", {
      roomId: roomId,
      userId: user.id
    }).then(res => {
      rtcClient.leave();
      navigate("/")
    })
  }




  return <div className={styles.home}>

    <div className={styles.content}>
      <div className={styles.filters}>
        <div className={styles.itemFilters}>
          <div className={styles.itemFilterTop}>
            <div className={styles.itemFilterTopFont}>Has {room.users.length} total user</div>
            {
              room.users.map((item, i) => {
                return <div key={item.id} style={{ marginTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center",marginBottom:10 }}>
                    <img style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10, marginRight: 10 }} src={'http://localhost:32326/file?id=' + item.avatar} alt=""></img>
                    <div style={{ display: "flex", flex: 1, justifyContent: "space-between", padding: "0px 10px 0px 0px" }}>
                      <span >{item.name}</span>
                      {i === 0 ? <span style={{ color: "#5454ff" }}>owner</span> : ""}
                    </div>
                  </div>

                </div>
              })
            }
          </div>
        </div>

      </div>

      <div className={styles.videosContent}>

        <div className={styles.top}>
          Metting room no:{params.id}
        </div>
        <div className={styles.videos}>
          <div id="video-grid" style={{ flex: 1, display: "flex", flexWrap: "wrap" }}>
            <div id="main-video" style={{ justifyContent: "flex-end", width: "300px", margin: 10 }}>

            </div>
          </div>
        </div>
        <div className={styles.bottomButtons}>
          <img src={!closeAudio ? '/images/audioopen.png' : '/images/audioclosed.png'} style={{ width: 25, height: 25, cursor: "pointer" }} alt="" onClick={() => {
            clickCloseAudio();
          }}></img>
          <button className={styles.leaveButton} onClick={() => {
            leaveRoom()
          }}>Leave Room</button>
          <img src={!closeCamera ? '/images/cameraopen.png' : '/images/cameraclosed.png'} style={{ width: 25, height: 25, marginLeft: 10, cursor: "pointer" }} alt="" onClick={() => {
            clickCloseCamera();
          }}></img>

          <img src={!closeShareScreen ? '/images/sharescreenopen.png' : '/images/sharescreenclosed.png'} style={{ width: 25, height: 25, marginLeft: 10, cursor: "pointer" }} alt="" onClick={() => {
            clickShareScreen();
          }}></img>


        </div>
      </div>
      <div className={styles.chats}>

        <div className={styles.chatsCaption}>
          Chat room
        </div>
        <div className={styles.chatsContent} id="chatList">
          {
            room.chats.map((item) => {
              return <div key={item.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                  <span style={{ padding: "5px 10px", backgroundColor: "#eee", borderRadius: 20, color: "#888" }}>{item.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10, marginRight: 10 }} src={'http://localhost:32326/file?id=' + item.senderAvatar} alt=""></img>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{item.senderName}</span>
                    <div style={{ display: "flex", alignItems: "center", backgroundColor: "#5465ff", color: "#fff", borderRadius: 10, padding: "3px 10px" }}>
                      {item.content}
                    </div>
                  </div>
                </div>

              </div>
            })
          }
        </div>
        <div className={styles.chatsBottom}>
          <Input value={msgContent} addonAfter={<SendOutlined onClick={() => {
            sendMsg();
          }} />} style={{ width: "100%", borderRadius: 5, marginBottom: 10 }} onChange={(e) => {
            setMsgContent(e.target.value);
          }}></Input>
        </div>

        <div className={styles.qipaoChatsBottom}>
          <textarea value={qipaoMsgContent} style={{ backgroundImage: "url('/images/qipao.png')", backgroundSize: "100% 100%", border: "none", outline: "none", padding: "10px 50px 20px 10px", width: "100%", height: "90px", borderRadius: 5, marginBottom: 10, backgroundColor: "transparent" }} onChange={(e) => {
            setQipaoMsgContent(e.target.value);
          }}></textarea>
          <Button type="primary" onClick={() => {
            sendQipaoMsg();
          }}>Send</Button>
        </div>

      </div>
    </div>

    {
      qipao ? <div className={styles.qipao}>
        <div style={{ backgroundImage: "url('/images/qipao.png')", backgroundSize: "100% 100%", border: "none", outline: "none", padding: "10px 50px 10px 10px", width: "100%",minWidth:"200px",minHeight:"60px", borderRadius: 5, marginBottom: 10, backgroundColor: "transparent",display:"flex",alignItems:"center" }} ><span>{qipao.content}</span></div>
        <img src={'http://localhost:32326/file?id=' + qipao.senderAvatar} alt="" style={{width:50,height:50,borderRadius:30,marginLeft:10}}></img>
      </div> : ""

    }
  </div>
}

