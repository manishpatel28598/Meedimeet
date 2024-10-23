import React from "react";
import { AdminMenu, UserMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, message } from "antd";
import clearUser from "../redux/features/userSlice";

function Layout({ children }) {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //logout function
  const handleLogout = () => {
    localStorage.clear();
    dispatch(clearUser());
    message.success("Logout successfull");
    navigate("/login");
  };

  // ---------------doctor menu--------------
  const doctorMenu = [
    {
      name: "Home",
      path: "/home",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointment",
      path: "/doctor-appointments",
      icon: "fa-solid fa-handshake-simple-slash",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-regular fa-user",
    },
  ];

  //rendring menu list
  const SidebarMenu = user?.isAdmin
    ? AdminMenu
    : user?.isDoctor
    ? doctorMenu
    : UserMenu;
  return (
    <div className="p-5 flex h-screen w-screen">
      <div className="flex w-screen">
        <div className="w-80 min-h-full rounded-md bg-red-800 shadow-neutral-600 shadow-sm me-5">
          <div className="text-white p-2 text-2xl text-center ">MediMeet</div>
          <br />
          <hr />
          <div className="text-white p-2 ">
            {SidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <>
                  <div className={`flex mt-8 cursor-pointer menu-list `}>
                    <div className="p-1">
                      <i className={menu.icon}></i>
                    </div>
                    <div className="p-1">
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </div>
                </>
              );
            })}

            <div
              className={`flex mt-8 cursor-pointer menu-list `}
              onClick={handleLogout}
            >
              <div className="p-1">
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
              </div>
              <div className="p-1">
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex-grow flex-col">
          <div className="h-14 mb-5 shadow-gray-600 shadow-sm bg-white flex flex-col items-end">
            <div className="pt-3 px-4 cursor-pointer">
              <Badge
                count={user?.notification.length}
                onClick={() => {
                  navigate("/notification");
                }}
              >
                <i class="fa-solid fa-bell fa-2x"></i>
              </Badge>
              <Link to="/profile" className="uppercase mx-5">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="h-5/6 flex-grow shadow-gray-600 shadow-sm bg-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
