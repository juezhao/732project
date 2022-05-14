
var mysql = require('mysql');

var pool = mysql.createPool({
  host: '139.196.40.161',
  port: "13080",
  user: 'root',
  password: 'Bboy120708',
  database: 'waimai'
});//创建一个pool连接池
console.log('创建链接迟', pool);
exports.query = async function (sql, params) {
  let connection = await new Promise((resolve, reject) => {
    try {
      pool.getConnection(function (err, connection) {

        if (err) {
          console.log('链接 err - ', err);
          //reject(err);
          return;
        }
        resolve(connection)
      });//获取
    } catch (e) {
      console.log('链接 22211err - ', e);
      reject("error");
    }

  });
  connection.on('error', function (err) {

    console.log('链接 db error', err);

    if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually

      

    } else { // connne
    }
  })
  let res = await new Promise((resolve, reject) => {
    try {
      connection.query(sql, params, function (err, result) {
        if (err) {
          console.log('[INSERT ERROR] - ', err.message);
          //reject(err);
          return;
        }
        resolve(result)
      });
      connection.release();
    } catch (e) {
      console.log('链接 11err - ', e);
      reject("error");
    }
  })


  return res;
}

exports.getConnection = async function () {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        //reject(err);
        return;
      }
      resolve(connection)
    });//获取
  });
}