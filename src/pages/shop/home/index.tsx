import { useLazyQuery } from '@apollo/client'
import { Box, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import Shop_UID_Required from '../../../../components/utils/Shop_UID_Required'
import { Business } from '../../../interfaces/business.interface'
import { Firebase_User } from '../../../interfaces/firebase_user.interface'
import GET_BUSINESS from '../../../lib/apollo/queries/business'

interface Props {
    business: Business
}

const index = () => {
    const router = useRouter();

    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [getBusiness, { error, data }] = useLazyQuery<Props>(GET_BUSINESS);


    console.log(data?.business.phone);


    useEffect(() => {
        if (!user?.accountId) return

        getBusiness({
            variables: {
                id: user.accountId
            }
        })

        return () => {

        }
    }, [user])
    return (
        <Shop_UID_Required>
            <Desktop_Layout>
                <h1 className='italic text-xl lg:text-2xl font-extrabold mb-4'>I tuoi negozi</h1>
                <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3 gap-x-2.5 gap-y-3.5 '>
                    <Box maxW='sm' borderWidth='1px' borderRadius='xl' overflow='hidden'
                        className='cursor-pointer'
                        minH={['200px', '300px']}
                        bgColor={'gray.50'}
                        _active={{
                            transform: 'scale(0.99)',
                        }}
                        onClick={() => {
                            router.push('/shop/home/crea-shop')
                        }}
                    >
                        <div className='flex justify-center h-full items-center text-gray-600
                    '>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-6 h-6 mr-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            <Text fontSize={'lg'}
                                fontWeight={'bold'}
                            >
                                Aggiungi negozio
                            </Text>
                        </div>

                    </Box>
                    {data?.business?.shops && data.business.shops.map((shop) => {
                        return (
                            <Box key={shop.id} maxW='sm' borderWidth='1px' borderRadius='xl' overflow='hidden'
                                minH={['200px', '300px']}
                                className='cursor-pointer'
                                _active={{
                                    transform: 'scale(0.99)',
                                }}
                            >
                                <img src={'https://ik.imagekit.io/veploimages/fa7b4b31-b8f2-4274-afc4-30c073f7ba13?tr=w-720,h-450'}
                                    alt={'immagine non trovata'}
                                />
                                <Box py={3} px={4}>
                                    <Box display='flex' alignItems='baseline'>
                                        {/* <Badge borderRadius='full' px='2' colorScheme='teal'>
                            New
                        </Badge> */}
                                        <Box
                                            color='gray.500'
                                            fontWeight='semibold'
                                            letterSpacing='wide'
                                            fontSize='xs'
                                            textTransform='uppercase'

                                        >
                                            {shop.status}
                                        </Box>
                                    </Box>

                                    <Box
                                        mt='1'
                                        fontWeight='semibold'
                                        as='h4'
                                        lineHeight='tight'
                                        noOfLines={1}
                                    >
                                        {shop.name}
                                    </Box>
                                    <Box
                                        fontWeight='normal'
                                        as='h5'
                                        fontSize={'sm'}
                                        mt={-1}
                                        lineHeight='tight'
                                        noOfLines={1}
                                    >
                                        {shop.address.street}, {shop.address.city}
                                    </Box>




                                </Box>
                            </Box>
                        )
                    })
                    }

                </div>

            </Desktop_Layout >
        </Shop_UID_Required>

    )
}

export default index