import { MdHome } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { FaList} from "react-icons/fa";

export const userMenu = [
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
    path: "/user-appointments",
    icon: <FaList className='w-5 h-auto ml-3' />
  },
  {
    name: (
      <>
        <span className='ml-2 font-bold'>Apply Doctor</span>
      </>
    ),
    path: "/apply-doctor",
    icon: <FaUserDoctor className='w-5 h-auto mx-3' />
  }
];

export const adminMenu = [
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
        <span className='ml-5 font-bold'>Users</span>
      </>
    ),
    path: "/admin/user",
    icon: <FaList className='w-5 h-auto ml-3' />
  },
  {
    name: (
      <>
        <span className='ml-2 font-bold'>Doctors</span>
      </>
    ),
    path: "/admin/doctor",
    icon: <FaUserDoctor className='w-5 h-auto mx-3' />
  }
];