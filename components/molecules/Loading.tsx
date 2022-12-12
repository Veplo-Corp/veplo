import { Center, CircularProgress } from '@chakra-ui/react'
import React from 'react'

const Loading = () => {
    return (
        <Center className='mt-40 xl:mt-20 h-96 m-auto' color='white'>
            <CircularProgress
                size='50px'
                isIndeterminate color='gray.300' />
        </Center>
    )
}

export default Loading