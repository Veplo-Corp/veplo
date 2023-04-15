import { Box } from '@chakra-ui/react'
import React, { FC } from 'react'

const Gradient_Component_home: FC<{ children: any }> = ({ children }) => {
    return (
        <Box
            className={`w-full min-h-96 px-4 bg-[#F8F8F8] pb-56 md:min-h-screen
            
            bg-[url('/home_svg/copertina.png')] object-cover
            `}
            style={{
                //background: 'linear-gradient(180deg, rgba(192,133,228,0.9206276260504201) 0%, rgba(192,133,228,0.40242034313725494) 50%, rgba(192,133,228,0) 100%)'
                //background: 'linear-gradient(180deg, rgba(192,133,228,0.9206276260504201) 0%, rgba(192,133,228,0.702140231092437) 53%, rgba(192,133,228,0) 100%)'

            }}


        >
            {children}
        </Box>
    )
}

export default Gradient_Component_home