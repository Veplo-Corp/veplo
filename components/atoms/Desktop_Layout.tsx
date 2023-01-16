import React from 'react'
import { useSelector } from 'react-redux';

const Desktop_Layout:React.FC<{children:any}> = ({children}) => {

  const user = useSelector((state:any) => state.user.user);  
  return (
    <div className={`p-3 pt-16 md:p-10  ${!user ? 'md:pt-28': 'md:pt-20'} min-h-[800px]  lg:min-h-screen`}>
        {children}
    </div>
  )
}

export default Desktop_Layout