const Koa = require('koa');
const Router = require('koa-router');
const fs = require('fs');
const path = require('path');
var cors = require('koa2-cors');

const koaBody = require('koa-body');
const staticFile = require('koa-static');
const send = require('koa-send');
const { createServer } = require("http");
const app = new Koa();
const { Server } = require("socket.io");

const { Api } = require("./service/tecent_video");

console.log("API",Api)



const httpServer = createServer(app.callback());
const io = new Server(httpServer, { /* options */ });
var socketDeal = require('./socket.js');

const router = new Router();

const { uuid, readFileArray, writeFile } = require("./utils")
const moment = require("moment");


io.on('connection', function (socket) {
  console.log("连接建立");

  socketDeal.init(socket);

});

app.use(cors({
  credentials: true,
  methods: ['GET', 'PUT', 'POST']
}));
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}));


function responseSuccess(data) {
  return {
    code: 0,
    msg: "保存成功",
    data: data
  }
}

function responseFaild(msg) {
  return {
    code: 1,
    msg: msg || "系统失败",
    data: null
  }
}
router.post('/uploadfile', async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  let filePath = uuid();
  // 创建可写流
  const upStream = fs.createWriteStream(path.join(__dirname, "static/" + filePath));
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = filePath;
});

router.get('/file', async (ctx) => {
  const id = ctx.query.id;
  const path = 'static/' + id;
  ctx.attachment(path);
  await send(ctx, path);
});


router.post('/api/signin', async (ctx) => {
  // 查询数据
  let {
    email,
    password
  } = ctx.request.body;
  let res = readFileArray("./database/users.json");

  let user = res.find(item => item.email === email && item.password === password)

  // let res = await DBUtils.query(
  //   'select * from user where email=? and password=?',
  //   [email, password]);
  if (user) {

    ctx.body = responseSuccess(user);
  } else {
    ctx.body = responseFaild("Email or password is not correct!");
  }

});



router.post('/api/getUserSign', async (ctx) => {
  // 查询数据
  let {
    id
  } = ctx.request.body;


  // let res = await DBUtils.query(
  //   'select * from user where email=? and password=?',
  //   [email, password]);
  Api.prototype.sdkappid=1400679119;
  Api.prototype.key ="bb7dfe118050713f36e0bc88d2e13f115616e1df2a0bfa5987dfcc3da06d3e03";

  ctx.body = responseSuccess({
    userSign: Api.prototype.genUserSig(id, 86400)
  });


});




router.post('/api/signup', async (ctx) => {
  const {
    name,
    password,
    email,
    type,
    avatar
  } = ctx.request.body;
  let res = readFileArray("./database/users.json");

  let user = res.find(item => item.email === email)
  if (user) {
    ctx.body = responseFaild("Email is registerd by others!");
    return;
  }
  let u = {
    id: uuid(),
    name,
    password,
    email,
    type,
    avatar
  };
  res.push(u)
  writeFile("./database/users.json", JSON.stringify(res), true);

  // let res = await DBUtils.query(
  //   'insert into user(name,password,email,avatar,type,createtime) VALUES(?,?,?,?,?,?)',
  //   [name, password, email, avatar, type, moment().format("YYYY-MM-DD HH:mm:ss")]);
  ctx.body = responseSuccess(u);
});


router.post('/api/room/get', async (ctx) => {
  // 查询数据
  let {
    id
  } = ctx.request.body;
  let res = readFileArray("./database/rooms.json");
  if (res[id]) {
    ctx.body = responseSuccess(res[id]);
  } else {
    ctx.body = responseFaild("Room is not exist!");
  }

});



router.post('/api/joinRoom', async (ctx) => {
  // 查询数据
  let {
    roomId,
    user
  } = ctx.request.body;
  let room = socketDeal.addUser(roomId,user);
  ctx.body = responseSuccess(roomId);

});

router.post('/api/leaveRoom', async (ctx) => {
  // 查询数据
  let {
    roomId,
    userId
  } = ctx.request.body;
  let room = socketDeal.leaveRoom(roomId,userId);
  ctx.body = responseSuccess("");
});




router.post('/api/createRoom', async (ctx) => {
  const {
    id,
    name,
    avatar
  } = ctx.request.body;
  let res = readFileArray("./database/rooms.json");

  let room = {
    id: new Date().getTime()+"",
    users: [{
      id,
      name,
      avatar
    }],
    chats: []
  };
  res[room.id] = room
  writeFile("./database/rooms.json", JSON.stringify(res), true);
  socketDeal.addRoom(room);

  ctx.body = responseSuccess(room);
});


router.post('/api/getAllRooms', async (ctx) => {
  const {
    
  } = ctx.request.body;
  let res = readFileArray("./database/rooms.json");
  ctx.body = responseSuccess(res);
});

router.post('/api/food/query', async (ctx) => {
  // 查询数据
  let {
    owner
  } = ctx.request.body;
  let res = await DBUtils.query(
    'select * from food where owner=?',
    [owner]);
  ctx.body = responseSuccess(res);
});


app.use(staticFile(path.join(__dirname)));

app.use(router.routes());


httpServer.listen(32326)
console.log('app started at port 32326...')

