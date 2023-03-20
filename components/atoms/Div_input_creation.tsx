import React from 'react'

const Div_input_creation: React.FC<any> = ({ children, text }) => {
    return (
        <div className='mb-2 w-full'>
            <p className='text-sm text-gray-600 font-normal mb-px'>
                {text}
            </p>
            {children}
        </div>
    )
}

export default Div_input_creation