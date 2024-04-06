import React from 'react'
import { Link } from 'react-router-dom'

function PublicRoute({children}) {
  if(localStorage.getItem("token")){
    return <Link to="/" />
  } else {
    return children
  }
}

export default PublicRoute