import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button } from '@chakra-ui/react'
import React from 'react'
import { sendEmailVerificationHanlder } from '../utils/emailVerification';
import { ToastOpen } from '../utils/Toast';


const Verified_Email = () => {
    const { addToast } = ToastOpen();

    const sendEmailVerification = async () => {

        const response = await sendEmailVerificationHanlder();
        console.log(response);
        if(response === true){
            return addToast({ position: 'top', title: 'Email inviata con successo', description: 'controlla la tua casella mail', status: 'info', duration: 5000, isClosable: true })
        } else if(response === 'auth/too-many-requests') {
            return addToast({ position: 'top', title: 'Hai effettuato troppe richieste', description: 'hai richiesto troppe volte la mail di convalida, controlla la tua casella mail', status: 'error', duration: 5000, isClosable: true })
        } else {
            return addToast({ position: 'top', title: 'Impossibile inviare email', description: 'non riusciamo a inviarti la mail, riprova più tardi', status: 'warning', duration: 5000, isClosable: true })
        }



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
                        <Button colorScheme={'black'} variant='link' onClick={sendEmailVerification}>
                            <span className='underline'>invia mail di nuovo</span>
                        </Button>
                    </div>
                </AlertDescription>
            </Box>
            <div className='hidden lg:flex justify-end'>
                <Button onClick={sendEmailVerification} colorScheme={'orange'}>
                    invia nuova mail
                </Button>
            </div>

        </Alert>
    )
}

export default Verified_Email