
import io from 'socket.io-client'


import * as storage from "./storage";
let socket;
let onRecieveMessage;
let user;

export function setOnRecieveMessage(call) {
  this.onRecieveMessage = call;
}

let messageList = [];

function addMessage(msg) {
  let m = messageList.find((item) => item.id === msg.id);
  if (!m) {
    messageList.push(msg);
  }
}

export function init(roomId,onRecieveMsg) {
  user = storage.getUser();
  let socketUrl = ""
  // if (process.env.NODE_ENV === "development") {
    socketUrl = "ws://localhost:32326";
  // } else {
  //   socketUrl = "wss://www.xiaowanwu.cn";
  // }

  // 连接服务器, 得到与服务器的连接对象
  socket = io(socketUrl, {
    reconnection: true,
    forceNew: true,
    transports: ['websocket'],
  });
  socket.on("connect", () => {
    // _this.$toast.clear();
    sendNew(roomId);
    
    // if(!_this.room.id){
    //   sendHasRoom();
    // }else{
    //   sendGetRoom(_this.room.id);
    // }
    
  });
  socket.on("disconnect", () => {
    // _this.$toast.loading({
    //   duration: 0, // 持续展示 toast
    //   forbidClick: true,
    //   message: "断线重连..."
    // });
  });


  let cmds = ["room", "ready", "start","join", "chat", "error","qipao"];
  cmds.forEach(cmd => {
    // 绑定监听, 接收服务器发送的消息
    socket.on(cmd, function (data) {
      onRecieveMsg(cmd, data);
    })
  })



  return;
}

function sendNew(roomId,call) {
  let user = storage.getUser();
  user.roomId = roomId;
  sendMessage("new", user, call);
}


export function sendConnect(call) {
  let json = {};
  json["t"] = "";
  sendMessage("connect", json, call);
}


export function sendChat(message, call) {
  sendMessage("chat", message, call);
}

export function sendQipaoChat(message, call) {
  sendMessage("qipao", message, call);
}



export function sendJoin(roomId, call) {
  let json = {};
  json["roomId"] = roomId;
  sendMessage("join", json, call);
}

function sendMessage(cmd, content, callback) {
  let user = storage.getUser();

  //向后端发送命令
  const obj = {
    cmd,
    content,
    from: user.id,
  };
  obj.callback = callback;
  content.from = user.id;
  messageList.push(obj);
  socket.emit(cmd, content);
}
