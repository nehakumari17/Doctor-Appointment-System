import React, { useEffect, useState } from 'react'
import DocApp from './DocApp';
import axios from 'axios'
import DoctorList from '../components/DoctorList';
import { useSelector } from 'react-redux';

function HomePage() {
  const user = useSelector((state) => state.user)

  const onlyShow = user && !user.user?.isDoctor && !user.user?.isAdmin

  const [doctors, setDoctors] = useState([]);
  const getUserData = async () => {
    try {
      const res = await axios.get(
        `${window.location.origin}/api/getAllDoctors`,

        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

    useEffect(() => {
        getUserData();
      }, []);
  return (
    
        <DocApp>
        <h1 className='text-center text-2xl p-2'>Home page</h1>
        {onlyShow ? (
        <div className='flex flex-row'>
          {doctors.map((doctor) => (
            <DoctorList key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : null}
        
        
        </DocApp>
    
  )
}

export default HomePage