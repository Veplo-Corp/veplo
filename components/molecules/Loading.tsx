import { Box, Center, CircularProgress } from '@chakra-ui/react'
import React from 'react'

const Loading = () => {
    return (
        <Center color='white'>
            <CircularProgress
                size='50px'
                isIndeterminate color='gray.300' />
        </Center>


    )
}

export default Loading