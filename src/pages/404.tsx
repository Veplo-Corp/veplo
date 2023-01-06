import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import Desktop_Layout from '../../components/atoms/Desktop_Layout'

const Error404 = () => {
    
    const router = useRouter();
    console.log(router);    
    return (
        <div className='text-center h-screen content-center'>
            <div className='absolute w-full top-44 md:top-48'>
                <h1 className='font-extrabold text-2xl uppercase mb-10 text-[#707070] px-9 line-clamp-2'>
                    {router.query?.errorText ? router.query?.errorText : 
                    <span>
                        Ci dispiace,<br />ma non troviamo la pagina
                    </span>
                    }
                </h1>
                <img
                    className='m-auto h-28 w-28 mb-6'
                    src="/error/404.svg"
                    alt="non trovata" />

                <Button
                    colorScheme={'blackAlpha'}
                    onClick={() => { router.push('/') }}
                >Torna alla Home</Button>
            </div>
        </div>
    )
}

export default Error404