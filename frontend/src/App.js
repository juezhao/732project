import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import React from 'react';

import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import Home from "./pages/Home/Home";

import Navbar from "./components/Navbar/Navbar"

import Footer from "./components/Footer/Footer"
import Profile from "./pages/Profile/Profile"
import UploadFood from "./pages/UploadFood/UploadFood"
import Room from "./pages/Room/Room"

import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const GetRoutes = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <><Navbar></Navbar><Home></Home><Footer></Footer></>
    },
    {
      path: '/profile',
      element: <><Navbar></Navbar><Profile></Profile><Footer></Footer></>
    },
    {
      path: '/signup',
      element: <><Navbar></Navbar><Signup></Signup><Footer></Footer></>
    },
    {
      path: '/room/:id',
      element: <><Navbar></Navbar><Room></Room><Footer></Footer></>
    },
    {
      path: '/signin',
      element: <><Navbar></Navbar><Signin></Signin><Footer></Footer></>
    },{
      path: '/uploadFood',
      element: <><Navbar></Navbar><UploadFood></UploadFood></>
    }
  ]);
  return routes;
}
function App() {
  console.log("app...")
  return (
    <Router>
      {/* <Routes>
        <Route path='/' element={Home} />
      </Routes> */}
      <GetRoutes />
    </Router>
  );
}

export default App;
