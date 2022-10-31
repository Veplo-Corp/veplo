import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button } from '@chakra-ui/react';
import { sendEmailVerification } from '@firebase/auth';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import { sendEmailVerificationHanlder } from '../../../../components/utils/emailVerification';
import { auth } from '../../../config/firebase';


const index = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    return (
        <Desktop_Layout>
            {!user.emailVerified &&
                <Alert status='warning' maxW={1000} className='m-auto' >
                    <AlertIcon />
                    <Box className='w-full'>
                        <AlertTitle className='hidden md:flex'>Convalida la tua mail!</AlertTitle>
                        <AlertDescription className='text-md'>
                            vai alla mail per convalidare l'account
                            <br />
                            <div className='flex md:hidden '>
                                <Button colorScheme={'black'} variant='link'>
                                    <span className='underline'>invia mail di nuovo</span>
                                </Button>
                            </div>
                        </AlertDescription>


                    </Box>
                    <div className='hidden md:flex justify-end'>
                        <Button onClick={sendEmailVerificationHanlder} colorScheme={'orange'}>
                            invia nuova mail
                        </Button>
                    </div>

                </Alert>}
        </Desktop_Layout>
    )
}

export default index