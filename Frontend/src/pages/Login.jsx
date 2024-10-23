import React from "react";
import { Button, Form, Input, message } from "antd";
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import {Link, useNavigate} from 'react-router-dom'
import axios from "axios";

function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    //form handler
    const onFinishHandler = async (values) =>{
      try {
        dispatch(showLoading())
        const res = await axios.post('/api/v1/user/login',values);
        window.location.reload()
        dispatch(hideLoading());
        if(res.data.success){
          localStorage.setItem("token", res.data.token);
          message.success("Login Successfully");
          navigate("/")
        }else{
          message.error(res.data.message);
        }
      } catch (error) {
        dispatch(showLoading())
        message.error("something went wrong");
      }
  };

  return (
    <>
      <div className="form-container flex items-center justify-center min-h-screen">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="ms-5 mt-5 bg-slate-700 p-5 w-96 rounded-xl shadow-2xl"
        >
            <h3 className="text-xl text-white text-center">Login Form</h3>
          <Form.Item
            label={<span className="text-white">Email</span>}
            name="email"
          >
            <Input type="text" required />
          </Form.Item>
          <Form.Item
            label={<span className="text-white">Password</span>}
            name="password"
          >
            <Input type="password" required />
          </Form.Item>
          <Button className="btn mt-4 primary" type="primary" htmlType="submit">
           Login
          </Button><br/>
          <Link to="/register" className="text-white">To Register Click Here</Link>
        </Form>
      </div>
    </>
  );
}

export default Login

