import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

const Create_Shop_Alert = () => {

    //! da eliminare
    const router = useRouter()
    return (
        <Alert status='error' maxW={1000} className='m-auto' >
            <AlertIcon />
            <Box className='w-full'>
                <AlertTitle className='hidden md:flex'>Il negozio non è stato ancora creato!</AlertTitle>
                <AlertDescription className='text-md'>
                    <span className='leading-0'>
                        Per inserire i prodotti bisogna creare prima il negozio
                    </span>
                    <br />
                    <div className='flex lg:hidden mt-2 '>
                        <Button colorScheme={'black'} variant='link'
                            onClick={() => router.push('/shop/crea-shop')}
                        >
                            <span className='underline'>Crea il negozio</span>
                        </Button>
                    </div>
                </AlertDescription>
            </Box>
            <div className='hidden lg:flex justify-end'>
                <Button onClick={() => router.push('/shop/crea-shop')} colorScheme={'orange'}>
                    crea il negozio
                </Button>
            </div>

        </Alert>
    )
}

export default Create_Shop_Alert