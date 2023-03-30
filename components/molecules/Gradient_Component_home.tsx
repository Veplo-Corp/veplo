import React, { FC } from 'react'

const Gradient_Component_home: FC<{ children: any }> = ({ children }) => {
    return (
        <div
            className={`w-full flex justify-between h-screen`}
            style={{
                background: 'linear-gradient(180deg, rgba(184,121,227,1) 71%, rgba(192,133,228,0) 100%)'
            }}
        >
            {children}
        </div>
    )
}

export default Gradient_Component_home