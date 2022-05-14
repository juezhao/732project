const fs = require('fs');

exports.uuid = function () {
  var guid = "a";
  for (var i = 1; i <= 31; i++) {
    var n = Math.floor(Math.random() * 16).toString(16);
    guid += n;
    if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) {
      guid += "";
    }
  }
  guid += "";
  return guid;
}
exports.readFileArray = function (file) {
  let str = fs.readFileSync(file, 'utf8');
  return JSON.parse(str);
}

exports.readFile = function (file) {
  return fs.readFileSync(file, 'utf8');
}
exports.deleteFile = function (file) {
  return fs.readFileSync(file, 'utf8');
}
exports.writeFile = function (file, content, replace) {
  if (replace) {
    fs.writeFileSync(file, content);
    return "文件替换成功,file=" + file;
  } else {
    try {
      fs.accessSync(file, fs.F_OK);
      return "文件已经存在！file=" + file;
    } catch (e) {
      fs.writeFileSync(file, content);
      return "文件创建成功,file=" + file;
    }
  }
}