import React, { FC } from 'react'
import Desktop_Layout from '../atoms/Desktop_Layout'
import { Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const PageNotFound: FC<{ title: string, description?: string, imageSrc: string }> = ({ title, description, imageSrc }) => {
    const router = useRouter()
    return (
        <Desktop_Layout>
            <div className='text-center h-[screen] content-center'>
                <div className='absolute w-full top-32 md:top-48'>
                    <Text className='font-extrabold md:8/12 lg:w-6/12 m-auto text-2xl lg:text-3xl text-[#222222] px-9 line-clamp-2'>
                        <span>
                            {title}
                        </span>
                    </Text>
                    {description && <Text className='font-medium md:8/12 lg:w-6/12 m-auto text-md md:text-lg text-[#222222] px-9 line-clamp-2'>
                        <span>
                            {description}
                        </span>
                    </Text>}
                    <img
                        className='m-auto h-72 mb-6 mt-10'
                        src={imageSrc}
                        alt="non trovata" />

                    <Button
                        colorScheme={'blackAlpha'}
                        onClick={() => { router.push('/' + '?gatto=berry') }}
                    >Torna alla Home</Button>
                </div>
            </div>
        </Desktop_Layout>
    )
}

export default PageNotFound