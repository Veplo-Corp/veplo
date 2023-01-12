import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import Desktop_Layout from '../../components/atoms/Desktop_Layout'
import NoIndexSeo from '../../components/organisms/NoIndexSeo'
import { handleErrorGraphQL } from '../../components/utils/handleError_graphQL'

const Error404: FC = () => {

    const router = useRouter();
    const [errorText, seterrorText] = useState<undefined | string>()

    useEffect(() => {
        
      if(typeof router.query.error === 'string'){
        seterrorText(handleErrorGraphQL(router.query.error))
      }
      
    }, [router.query.error])
    

    return (
        <>
            <NoIndexSeo title='404' />
            <div className='text-center h-screen content-center'>
                <div className='absolute w-full top-44 md:top-48'>
                    <h1 className='font-extrabold md:8/12 lg:w-6/12 m-auto text-xl lg:text-2xl mb-10 text-[#707070] px-9 line-clamp-2'>
                        {errorText ? errorText :
                            <span>
                                Ci dispiace, ma non troviamo la pagina
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
        </>

    )
}

export default Error404