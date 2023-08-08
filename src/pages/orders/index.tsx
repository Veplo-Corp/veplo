import { Box, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Desktop_Layout from '../../../components/atoms/Desktop_Layout'
import OrderCart from '../../../components/molecules/OrderCart'
import { useSelector } from 'react-redux';
import { Order } from '../../interfaces/order.interface';
import Loading from '../../../components/molecules/Loading';
import { Firebase_User } from '../../interfaces/firebase_user.interface';
import { useRouter } from 'next/router';
import PageNotFound from '../../../components/molecules/PageNotFound';
import { useLazyQuery } from '@apollo/client';
import GET_USER_ORDERS from '../../lib/apollo/queries/getUserOrders';
import expirationTimeTokenControll from '../../../components/utils/expirationTimeTokenControll';


const index = () => {
    const router = useRouter()
    //const orders: Order[] = useSelector((state: any) => state.orders.orders);
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [getUserOrders, { error, data }] = useLazyQuery(GET_USER_ORDERS);

    const [noOrders, setNoOrders] = useState(false)

    useEffect(() => {
        if (user.statusAuthentication === 'logged_out') {
            router.replace('user/login?type=login&person=user')
        }
        const fetchData = async () => {
            if (user.statusAuthentication === 'logged_in' && !user.isBusiness) {
                const resolve = await expirationTimeTokenControll(user.expirationTime)
                if (!resolve) return
                getUserOrders()
            }
        }
        fetchData()
        setTimeout(() => {
            setNoOrders(true)
        }, 6000);
    }, [user])



    return (
        <>
            <Box
                className='w-[95%] sm:w-11/12 md:w-11/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 m-auto mt-4 md:mt-8 mb-12 '
            >
                {(!data?.user?.orders || data?.user?.orders.length <= 0) && !noOrders &&
                    <Box className='h-[60vh] md:h-[50vh] lg:h-[70vh] xl:h-[75vh]'
                        display={'flex'}
                        justifyContent={'center'}>
                        <Loading />
                    </Box>
                }
                {data?.user?.orders && data?.user?.orders.length > 0 &&
                    <VStack
                        gap={8}
                        width={'full'}
                    >

                        {data?.user?.orders && data?.user?.orders.map((order, index) => {
                            return (
                                <div key={index} className='w-full'>
                                    <OrderCart order={order} />
                                </div>
                            )
                        })}
                    </VStack>
                }
            </Box>




            {data?.user?.orders && data?.user?.orders.length <= 0 && noOrders &&
                <PageNotFound
                    title='non hai ancora effettuato ordini'
                    description='non hai nessun ordine collegato al tuo account'
                    imageSrc="https://www.datocms-assets.com/102220/1686599080-undraw_cancel_re_pkdm.png"
                />
            }
        </>

    )
}

export default index