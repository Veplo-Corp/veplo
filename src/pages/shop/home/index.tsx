import { useLazyQuery } from '@apollo/client'
import { Box, Tag, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { addShopFavouriteToLocalStorage } from '../../../../components/utils/shop_localStorage'
import { addFavouriteShopBusiness } from '../../../store/reducers/user'
import AddNewShopCard from '../../../../components/molecules/AddNewShopCard'
import BusinessShopCard from '../../../../components/molecules/BusinessShopCard'
import { initApollo } from '../../../lib/apollo'
import GET_SINGLE_PRODUCT from '../../../lib/apollo/queries/getSingleProduct'

interface Props {
    business: Business
}

const index = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [getBusiness, { error, data }] = useLazyQuery<Props>(GET_BUSINESS);

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
                if (business?.status === 'stripe_id_requested') {
                    router.push('/shop/crea-business-account')
                }

                //* deprecated perchè adesso puoi creare Shop
                //* e prodotti senza aver finito l'onboarding Stripe
                // if (business?.status === 'onboarding_KYC_requested') {
                //   router.push('/shop/continua-processo-kyc')  
                // }
            })



        return () => {

        }



    }, [user])



    //!test per tommaso golang

    useEffect(() => {
        const apolloClient = initApollo()



        // apolloClient.query({
        //     query: GET_SINGLE_PRODUCT,
        //     variables: { id: "641f2217ca22d34c3ca1ec35" }
        // }).then(a => {

        // })


    }, [])


    const toShop = (shop: Shop) => {
        const element = {
            id: shop.id,
            name: {
                unique: shop?.name.unique,
                visualized: shop?.name.visualized
            },
            street: shop?.address.city + ', ' + shop?.address.street
        }

        addShopFavouriteToLocalStorage(element)
        dispatch(
            addFavouriteShopBusiness(element)
        )

        return router.push(`/shop/home/${shop.id}/ordini?statusOrder=tutti&page=1`)
    }



    return (
        <Shop_UID_Required>
            <Desktop_Layout>
                {user && (data?.business?.status === 'onboarding_KYC_requested' || data?.business?.status === 'onboarding_KYC_requested_first_time') &&
                    <StripeAccountAlert stripeId={data.business.stripe.id} />
                }
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
                {false && !user.emailVerified && user.statusAuthentication === 'logged_in' && <Verified_Email />}
                <Text className='text-xl lg:text-2xl font-extrabold mb-4'>I tuoi brand e negozi</Text>
                <div className='grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3 gap-x-2.5 gap-y-3.5 '>
                    <AddNewShopCard />
                    {data?.business?.shops && data.business.shops.map((shop) => {
                        return (
                            <div key={shop.id}>
                                <BusinessShopCard shop={shop} toShop={toShop} />

                            </div>
                        )
                    })
                    }

                </div>

            </Desktop_Layout >
        </Shop_UID_Required>

    )
}

export default index