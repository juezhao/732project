
const { uuid, readFileArray, writeFile } = require("./utils")

// 状态 0:出牌中 1:碰 2:杠 3:胡 -1:准备 -2:未准备

const users = {};

const userSockets = {};

//0:未开始 1:开始 2:结束
const rooms =  readFileArray("./database/rooms.json");


let moke = false;
let roomNoAdd = 1000;

function wrapper(func, data) {
  try {
    console.log("接受到数据", data);
    let room;
    if (data.roomId) {
      room = rooms[data.roomId];
    }
    func(data, room);
  } catch (e) {
    console.log(e)
  }
}

module.exports.setRooms=function (rs) {
  rooms = rs;
}
module.exports.getRoom=function (id) {
 return rooms[id]
}


module.exports.addRoom=function (room) {
  rooms[room.id] = room;
}


module.exports.addUser=function (roomId,user) {
  let room = rooms[roomId];
  let findUser = room.users.find((item)=>user.id===item.id);
  if(findUser){
    
  }else{
    room.users.push(user)
    writeFile("./database/rooms.json", JSON.stringify(rooms), true);
  }
  
}
module.exports.leaveRoom=function (roomId,userId) {
  let room = rooms[roomId];
  let index = room.users.findIndex((item)=>userId===item.id);
  if(index>=0){
    room.users.splice(index,1);
    writeFile("./database/rooms.json", JSON.stringify(rooms), true);
  }
}




function sendRoomMessage(room, cmd, msg) {
  for (let i = 0; i < room.users.length; i++) {
    let u = room.users[i];
    let socket = userSockets[u.id];
    if (socket) {
      socket.emit(cmd, msg);
    }
  }
}

module.exports.init = function (socket) {
  socket.on('new', (data) => {
    wrapper((data,room) => {
      let us = {
        id: data.from,
        email:data.email,
        name: data.name,
        avatar: data.avatar
      };
      users[data.from] = us;
      userSockets[data.from] = socket;
      if(!room.users.find((item)=>item.id===us.id)){
        room.users.push(us);
      }
      console.log("当前用户数量", Object.keys(users).length);
    }, data)
  });
  
  socket.on('chat', (data) => {
    wrapper((data, room) => {
      let res = readFileArray("./database/rooms.json");
      res[room.id].chats.push(data);
      room.chats.push(data);
      writeFile("./database/rooms.json", JSON.stringify(res), true);
      sendRoomMessage(room, "chat", data);
    }, data)
  });

  socket.on('qipao', (data) => {
    wrapper((data, room) => {
      // let res = readFileArray("./database/rooms.json");
      // res[room.id].chats.push(data);
      // room.chats.push(data);
      // writeFile("./database/rooms.json", JSON.stringify(res), true);
      sendRoomMessage(room, "qipao", data);
    }, data)
  });

  

  socket.on('join', (data) => {
    wrapper((data, room) => {
      // 加入房间
      let user = users[data.from];
      
    }, data)
  });

}
