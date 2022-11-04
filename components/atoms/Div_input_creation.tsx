import React from 'react'

const Div_input_creation: React.FC<any> = ({ children, text }) => {
    return (
        <div className='mb-1 w-full'>
            <p className='text-xs text-gray-400 font-normal mb-px'>
                {text}
            </p>
            {children}
        </div>
    )
}

export default Div_input_creation