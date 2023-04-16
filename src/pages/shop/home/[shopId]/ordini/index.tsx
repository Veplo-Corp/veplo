import { useLazyQuery } from '@apollo/client';
import { Box, Tag, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo';
import TableOrdersShop from '../../../../../../components/organisms/TableOrdersShop';
import { Firebase_User } from '../../../../../interfaces/firebase_user.interface';
import { Order } from '../../../../../interfaces/order.interface';
import GET_SHOP_ORDERS from '../../../../../lib/apollo/queries/shopOrders';


const limit = 15;


function index() {
    const router = useRouter()
    const [getOrders, { error, data }] = useLazyQuery(GET_SHOP_ORDERS);
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [orders, setOrders] = useState<Order[]>([]);
    const [hasMoreData, setHasMoreData] = useState(false)
    useEffect(() => {
        const { shopId } = router.query
        if (user?.isBusiness || shopId) {
            getOrders({
                variables: {
                    id: shopId,
                    statuses: null,
                    limit: limit,
                    offset: 0
                }
            })
        }
    }, [user, router])

    useEffect(() => {
        if (data?.shop.orders) {
            if (data?.shop.orders.length % limit === 0) {
                setHasMoreData(true)
            } else {
                setHasMoreData(false)
            }
            if (orders.length === 0) {
                setOrders(data?.shop.orders)
            }
        }
    }, [data])

    const handleMoreOrders = () => {
        setHasMoreData(false)
        const { shopId } = router.query
        getOrders({
            variables: {
                id: shopId,
                statuses: null,
                limit: limit,
                offset: orders.length
            }
        }).then((element: any) => {
            if (!element?.data.shop.orders) return
            console.log(element?.data.shop.orders);

            if (element.data.shop.orders.length % limit === 0) {
                setHasMoreData(true)
            }
            setOrders(prevstate => {
                return [
                    ...prevstate,
                    ...element.data.shop.orders
                ]
            })
        })
    }





    return (
        <Desktop_Layout>
            <NoIndexSeo title={`Ordini | Veplo Shop`} />
            {data?.shop &&
                <Box
                    mb={4}
                >
                    <Tag size={'md'} variant='solid'
                        colorScheme={data?.shop?.status === 'active' ? 'green' : 'red'}
                    >
                        {data?.shop?.status === 'active' ? 'attivo' : 'non attivo'}
                    </Tag>
                    <Text
                        mt={-1}
                        fontSize={'2xl'}
                        fontWeight={'extrabold'}
                        fontStyle={'italic'}
                    >{data?.shop?.name}</Text>
                    <Text
                        mt={-1}
                        fontSize={'sm'}
                        fontWeight={'semibold'}
                        color={'gray.500'}
                    >{data?.shop?.address?.city}, {data?.shop?.address?.street}</Text>
                </Box>
            }

            {orders && <TableOrdersShop orders={orders} moreData={hasMoreData} handleMoreOrders={handleMoreOrders} />}
        </Desktop_Layout>
    )
}

export default index