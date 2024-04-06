import React, { useState } from 'react';
import DocApp from './DocApp';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NotificationPage() {

  const [activeTab, setActiveTab] = useState('unread'); 
  const navigate = useNavigate()
  

  const {user} = useSelector((state) => state.user)

  const handleMarkAllRead = async () => {
    try {
      const res = await axios.post(`${window.location.origin}/api/get-all-notification`, {userId: user._id}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      if(res.data.success){
        toast.success("Marked as read")
      } else {
        toast.error("Cannot mark as read")
      }
    } catch (error) {
      toast.error("Something went Wrong!!")
    }
    window.location.reload()
  };

  const handleDeleteAllRead = async () => {
    try{
      const res = await axios.post(`${window.location.origin}/api/delete-all-notification`, {userId: user._id}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      if(res.data.success){
        toast.success("Notifications deleted!!")
      } else {
        toast.error("Cannot delete notifications")
      }
    } catch(error) {
      toast.error("Something went wrong!!")
    }
    window.location.reload()
  };

  return (
    <DocApp>
      <Toaster />
      <div className="flex flex-col">
        <h1 className="pt-3 text-center text-3xl mb-8">Notifications</h1>
        
        {/* Tabs */}
        <div className="pt-3 flex items-start">
          <button
            className={`px-4 ${
              activeTab === 'unread' ? '' : ''
            }`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
            
          </button>
          <button
            className={`px-4${
              activeTab === 'read' ? '' : ''
            }`}
            onClick={() => setActiveTab('read')}
          >
            Read
          </button>
        </div>
        
        <hr className="w-full border-t-2 border-gray-400 my-1" />
        <div className="flex flex-col justify-end items-end"> 
            
          
        </div>
        

        {activeTab === 'unread' && (
          <div>
            <div className="flex justify-end">
            <button className="px-10 text-xl" onClick={handleMarkAllRead}>
            Mark all as Read
          </button>
          </div>
          <div>
            {user?.notification.map((notificationMsgs, index) => (
              <div key={index} className="border rounded-md m-2 p-3 cursor-pointer hover:bg-gray-100 transition duration-300" onClick={user.isAdmin ? () => navigate("/admin/doctor") : undefined}>
                {notificationMsgs.message}
              </div>
            ))}
            </div>
          </div>
          
        )}
        {activeTab === 'read' && (
          <div className=''>
            <div className="flex justify-end items-end">
            <button className="px-10 text-xl" onClick={handleDeleteAllRead}>
              Delete all read
            </button>
            </div>
            <div>
            {user?.seenNotification.map((notificationMsgs, index) => (
              <div key={index} className="border rounded-md m-2 p-3 cursor-pointer hover:bg-gray-100 transition duration-300">
                {notificationMsgs.message}
              </div>
            ))}
            </div>
            
          
          </div>
        )}
      </div>
    
    </DocApp>
  );
}

export default NotificationPage;
