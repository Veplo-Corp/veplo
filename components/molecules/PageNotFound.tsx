import React, { FC } from 'react'
import Desktop_Layout from '../atoms/Desktop_Layout'
import { Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const PageNotFound: FC<{ title: string, description?: string, imageSrc?: string }> = ({ title, description, imageSrc }) => {
    const router = useRouter()
    return (
        <>
            <div className='text-center h-[screen] content-center'>
                <div className=' mt-16 md:mt-28 m-auto'>
                    <Text className='font-extrabold md:8/12 lg:w-6/12 m-auto text-2xl lg:text-3xl text-[#222222] px-9 line-clamp-2'>
                        <span>
                            {title}
                        </span>
                    </Text>
                    {description && <Text className='font-medium md:8/12 lg:w-6/12 m-auto text-md md:text-lg text-[#222222] px-9 line-clamp-2 mb-6'>
                        <span>
                            {description}
                        </span>
                    </Text>}
                    {imageSrc && <img
                        className='m-auto h-72  mt-10'
                        src={imageSrc}
                        alt="non trovata" />}

                    <Button
                        variant={'primary'}
                        onClick={() => { router.push('/' + '?gatto=berry') }}
                    >Torna alla Home</Button>
                </div>
            </div>
        </>
    )
}

export default PageNotFound