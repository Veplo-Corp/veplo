import { useLazyQuery } from '@apollo/client'
import { Box, Tag, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import AlertChacraUI from '../../../../components/atoms/AlertChacraUI'
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout'
import StripeAccountAlert from '../../../../components/molecules/StripeAccountAlert'
import Verified_Email from '../../../../components/molecules/Verified_Email/Verified_Email'
import { imageKitUrl } from '../../../../components/utils/imageKitUrl'
import Shop_UID_Required from '../../../../components/utils/Shop_UID_Required'
import { Business } from '../../../interfaces/business.interface'
import { Firebase_User } from '../../../interfaces/firebase_user.interface'
import { Shop } from '../../../interfaces/shop.interface'
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
            .then(async (value) => {
                if (!value) return
                //redirect to the right page based on status
                const business = value.data?.business
                console.log(business);

                if (business?.status === 'stripe_id_requested') {
                    router.push('/shop/crea-business-account')
                }

                //! deprecated
                // if (business?.status === 'onboarding_KYC_requested') {
                //   router.push('/shop/continua-processo-kyc')  
                // }
            })
        return () => {

        }
    }, [user])

    const toShop = (id: string) => {
        return router.push(`/shop/home/${id}/ordini`)
    }



    return (
        <Shop_UID_Required>
            <Desktop_Layout>
                {user && (data?.business?.status === 'onboarding_KYC_requested' || data?.business?.status === 'onboarding_KYC_requested_first_time') &&
                    <StripeAccountAlert stripeId={data.business.stripe.id} />
                }
                {/* {user && user.emailVerified === false &&
                    <Verified_Email />
                } */}
                {user && data?.business?.status === 'pending' &&
                    <Box
                        mb={5}
                    >
                        <AlertChacraUI alert='success'
                            title='onboarding completato con successo'
                            subtitle="grazie per aver completato l'onboarding con Stripe. Il nostro team ti contatterà non appena il tuo account sarà abilitato"
                        />
                    </Box>
                }
                <h1 className='italic text-xl lg:text-2xl font-extrabold mb-4'>I tuoi negozi e brand</h1>
                <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3 gap-x-2.5 gap-y-3.5 '>
                    <Box maxW='sm' borderWidth='1px' borderRadius='xl' overflow='hidden'
                        className='cursor-pointer'
                        minH={['200px', '200px']}
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
                                Aggiungi
                            </Text>
                        </div>

                    </Box>
                    {data?.business?.shops && data.business.shops.map((shop) => {
                        return (
                            <Box key={shop.id} maxW='sm' borderWidth='1px' borderRadius='xl' overflow='hidden'
                                minH={['200px', '200px']}
                                className='cursor-pointer'
                                _active={{
                                    transform: 'scale(0.99)',
                                }}
                                onClick={() => toShop(shop.id)}
                            >
                                <img
                                    className='aspect-[12/7] object-cover'
                                    src={imageKitUrl(shop.profileCover)}
                                    alt={'immagine non trovata'}
                                />
                                <Box py={3} px={4}>
                                    <Box display='flex' alignItems='baseline'
                                        justifyContent={'space-between'}
                                    >
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
                                            {shop.isDigitalOnly === false ? 'FISICO' : 'DIGITALE'}
                                        </Box>
                                        <Tag
                                            fontSize={'xs'}
                                            size={'sm'}
                                            colorScheme={shop.status === 'active' ? 'green' : 'orange'}
                                        >
                                            {shop.status === 'active' ? 'ATTIVO' : 'DISATTIVATO'}
                                        </Tag>
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