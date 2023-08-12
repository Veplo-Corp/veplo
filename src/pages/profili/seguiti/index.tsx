import React from 'react'
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import { Box } from '@chakra-ui/react';

const index = () => {
    const user: Firebase_User = useSelector((state: any) => state.user.user);

    return (
        <Box
            px={[2, 2, 2, 6, 0]}
            className='mt-2 md:mt-5 min-h-[100vh]  w-full xl:w-10/12 2xl:w-9/12 xl:m-auto justify-items-center'
        >
        </Box>
    )
}

export default index