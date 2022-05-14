let menus = [
  {
    name: "Home",
    path:"/",
    children: [
      
    ]
  },
  {
    name: "UserCenter",
    path:"/profile",
  }, 
  {
    name: "Friend Links",
    path:"/",
    children: [
      {
        name: "Google",
        path:"http://www.google.cn"
      },
      {
        name: "Twitter",
        path:"http://www.twitter.cn"
      },
      {
        name: "FaceBook",
        path:"http://www.facebook.cn"
      }
    ]
  }
];
export default menus;