import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosLogOut, IoMdNotificationsOutline } from "react-icons/io";
import { adminMenu, userMenu } from './SideBar';
import toast, { Toaster } from 'react-hot-toast';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { MdHome } from "react-icons/md";
import { FaList, FaUser } from "react-icons/fa";

function DocApp({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const badgeRef = useRef(null);

  const user = useSelector(state => state.user);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    navigate("/login");
    window.location.reload();
  };

  const doctorMenu = [
    {
      name: (
        <>
          <span className='ml-2 font-bold'>Home</span>
        </>
      ),
      path: "/home",
      icon: <MdHome className='w-7 h-auto mx-2' />
    },
    {
      name: (
        <>
          <span className='ml-5 font-bold'>Appointments</span>
        </>
      ),
      path: "/doctor-appointments",
      icon: <FaList className='w-5 h-auto ml-3' />
    },
    {
      name: (
        <>
          <span className='ml-2 font-bold'>Profile</span>
        </>
      ),
      path: `/doctor/profile/${user?.user?._id}`,
      icon: <FaUser className='w-5 h-auto mx-3' />
    }
  ];
  
  const SideBarMenu = user && user.user?.isAdmin ? adminMenu : user && user.user?.isDoctor ? doctorMenu : userMenu
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-blue-100'>
        <Toaster />
        <div className='flex justify-start items-start w-full'>
          <div className='w-[20%] h-[97.5vh] mt-2 rounded-lg mx-4 mb-2' style={{ background: "#90adff" }}>
            <div>
              <h6 className='flex justify-center items-center mt-5 font-bold text-4xl mb-5'>Doc App</h6>
              <hr />
              
              {SideBarMenu.map((menu, index) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div key={index} className={`menu-item ${isActive ? "bg-blue-500 text-white rounded-full m-2" : ""}`}>
                    <Link to={menu.path} className="flex items-center">
                      <div className='ml-2'>{menu.icon}</div>
                      <div className='m-3'>{menu.name}</div>
                    </Link>
                  </div>
                );
              })}
              <div className='flex flex-row'>
                <IoIosLogOut className='w-6 h-auto ml-5 ' />
                <button className='ml-7 font-bold m-3' onClick={handleLogout}>Logout</button>
              </div>
                

            </div>
          </div>
          <div className='w-[80%] h-[100%] mt-2 lg:mr-4'>
            <div className=' relative h-[10vh] shadow-lg bg-white rounded-md mb-4'>
              <div className='absolute text-2xl p-5 right-4 flex '>
                <div className="ml-5 m-4" onClick={() => {navigate("/notification-page")}} style={{cursor: "pointer"}} >
                <IoMdNotificationsOutline className='w-6 h-auto font-bold' />
                <NotificationBadge
                  count={user.user?.notification.length || 0}
                  effect={Effect.SCALE}
                  style={{ position: 'absolute', top: '-30px', right: '-8px' }}
                  ref={badgeRef}
                />
                </div>
                <h2 className='ml-4 m-3 text-xl' >{user && user.user && user.user.name}</h2>
              </div>
            </div>
            <div className='h-[85vh] shadow-lg bg-white rounded-md'>{children}</div>
          </div>
        </div>
      </div>
    );
}

export default DocApp;