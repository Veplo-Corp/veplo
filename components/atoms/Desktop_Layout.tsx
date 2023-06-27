import React from 'react'
import { useSelector } from 'react-redux';

const Desktop_Layout: React.FC<{ children: any, noPaddingXMobile?: boolean }> = ({ children, noPaddingXMobile }) => {

  return (
    <div className={`${noPaddingXMobile ? ' p-0' : 'p-3'} pt-1 lg:pt-3 md:px-7 min-h-[800px]  lg:min-h-screen`}>
      {children}
    </div>
  )
}

export default Desktop_Layout