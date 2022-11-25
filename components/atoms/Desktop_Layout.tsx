import React from 'react'
import { useSelector } from 'react-redux';

const Desktop_Layout = ({children}) => {

  const user = useSelector((state) => state.user.user);  
  return (
    <div className={`p-3 pt-16 md:p-10  ${!user ? 'md:pt-28': 'md:pt-20'}`}>
        {children}
    </div>
  )
}

export default Desktop_Layout