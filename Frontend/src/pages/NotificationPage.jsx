import React from "react";
import Layout from "../components/Layout";
import { message, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong In Notification");
    }
  };
  return (
    <Layout>
      <h4 className="p-3 text-center">Notification Page</h4>
      <Tabs>
        <Tabs.TabPane tab="unRead" key={0}>
          <div className="flex justify-end me-4 cursor-pointer">
            <h4 onClick={handleMarkAllRead}>mark All Read</h4>
          </div>
          {user?.notification.map((notificationMsg) => (
            <div className="cursor-pointer border-r border-b border-l border-t border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-1 ps-2 bg-slate-600 text-white  flex flex-col justify-between leading-normal mt-2 me-2">
              <div
                className="card-text"
                onClick={() => navigate(notificationMsg.onClickPath)}
              >
                {notificationMsg.message}
              </div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key={1}>
          <div className="flex justify-end me-4 cursor-pointer">
            <h4 onClick={ handleDeleteAllRead }>Delete All Read</h4>
          </div>
          {user?.seennotification.map((notificationMsg) => (
            <div className="cursor-pointer border-r border-b border-l border-t border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 rounded-b lg:rounded-b-none lg:rounded-r p-1 ps-2 bg-slate-600 text-white  flex flex-col justify-between leading-normal mt-2 me-2">
              <div
                className="card-text"
                onClick={() => navigate(notificationMsg.onClickPath)}
              >
                {notificationMsg.message}
              </div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
};

export default NotificationPage;
