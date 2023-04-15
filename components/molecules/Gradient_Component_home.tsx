import { Box } from '@chakra-ui/react'
import React, { FC } from 'react'

const Gradient_Component_home: FC<{ children: any }> = ({ children }) => {
    return (
        <Box
            className={`w-screen h-[450px] md:h-screen
            `}
        //style={{
        //background: 'linear-gradient(180deg, rgba(192,133,228,0.9206276260504201) 0%, rgba(192,133,228,0.40242034313725494) 50%, rgba(192,133,228,0) 100%)'
        //background: 'linear-gradient(180deg, rgba(192,133,228,0.9206276260504201) 0%, rgba(192,133,228,0.702140231092437) 53%, rgba(192,133,228,0) 100%)'

        //}}


        >

            <Box
                className={`w-full h-full
            md:bg-[url('/home_svg/copertina.png')] 
            `}
            >
                {children}

            </Box>

        </Box >

    )
}

export default Gradient_Component_home