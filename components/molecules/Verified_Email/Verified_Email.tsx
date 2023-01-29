import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button } from '@chakra-ui/react'
import React from 'react'
import { ToastOpen } from '../../utils/Toast';
import { sendEmailVerificationHanlder } from '../../utils/emailVerification';
import { sendEmailVerification } from './'; //* posso importare tutto perchè nel index c'è *


const Verified_Email = () => {
    const { addToast } = ToastOpen();

    const handleSendEmail = async () => {
        const response = await sendEmailVerificationHanlder()
        addToast(sendEmailVerification(response))
    }

    return (
        <Alert status='warning' maxW={1000} className='m-auto mb-2' >
            <AlertIcon />
            <Box className='w-full'>
                <AlertTitle className='hidden md:flex'>Convalida la tua mail!</AlertTitle>
                <AlertDescription className='text-md'>
                    <span className='leading-0'>
                        Controlla la casella mail e convalida l'account, poi ricarica la pagina
                    </span>
                    <br />
                    <div className='flex lg:hidden mt-2 '>
                        <Button colorScheme={'black'} variant='link' onClick={handleSendEmail}>
                            <span className='underline'>invia mail di nuovo</span>
                        </Button>
                    </div>
                </AlertDescription>
            </Box>
            <div className='hidden lg:flex justify-end'>
                <Button onClick={handleSendEmail} colorScheme={'orange'}>
                    invia nuova mail
                </Button>
            </div>

        </Alert>
    )
}

export default Verified_Email