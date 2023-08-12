import { Box } from '@chakra-ui/react'
import React, { FC, ReactNode } from 'react'

const GrayBox: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Box
            mb={2}
            padding={4}
            background={'#F2F2F2'}
        >
            {children}
        </Box>
    )
}

export default GrayBox