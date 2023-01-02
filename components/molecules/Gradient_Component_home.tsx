import React, { FC } from 'react'

const Gradient_Component_home: FC<{ children: any, display: string }> = ({ children, display }) => {
    return (
        <div
            className={`h-fit md:min-h-[450px] mt-2 rounded-2xl md:${display} justify-between p-5 md:px-16 lg:px-20`}
            style={{
                background: 'linear-gradient(0deg, rgba(169,99,224,1) 0%, rgba(6,214,160,1) 100%)'
            }}
        >
            {children}
        </div>
    )
}

export default Gradient_Component_home