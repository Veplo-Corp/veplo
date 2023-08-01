import { useLazyQuery } from '@apollo/client';
import { Box, Select, Tag, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout'
import NoIndexSeo from '../../../../../../components/organisms/NoIndexSeo';
import TableOrdersShop from '../../../../../../components/organisms/TableOrdersShop';
import { Firebase_User } from '../../../../../interfaces/firebase_user.interface';
import { Order } from '../../../../../interfaces/order.interface';
import GET_SHOP_ORDERS from '../../../../../lib/apollo/queries/shopOrders';

import ShopInfoSection from '../../../../../../components/molecules/ShopInfoSection';
import Pagination from '../../../../../../components/molecules/Pagination';


const RANGE = 5;

const typeStatus = [
    {
        text: 'tutti',
        statuses: null
    },
    {
        text: 'da spedire',
        statuses: ["PAY01"]
    },
    {
        text: 'spediti',
        statuses: ["SHIP01", "SHIP02"]
    },
    {
        text: 'consegnati',
        statuses: ["SHIP03"]
    },
    {
        text: 'annullati',
        statuses: ["CANC01", "REF01"]
    },
    {
        text: 'resi',
        statuses: ["RET01", "RET02", "RET03", "REF02"]
    },
    {
        text: 'ordini mai arrivati',
        statuses: ["CANC02", "REF03"]
    }
]

function index() {
    const dispatch = useDispatch();

    const router = useRouter()
    const [getOrders, { error, data }] = useLazyQuery(GET_SHOP_ORDERS);
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        const { shopId, statusOrder, page } = router.query
        if (user?.isBusiness && shopId && statusOrder && router.isReady) {
            const tablePage = parseInt(page as string)
            const status = typeStatus.find(status => status.text === statusOrder)?.statuses
            console.log(status);
            //setOrders([])
            getOrders({
                variables: {
                    id: shopId,
                    statuses: status,
                    limit: RANGE * tablePage,
                    offset: RANGE * (tablePage - 1)
                }
            }).then((data: any) => {
                console.log(data);

                if (data?.data?.shop?.orders) {
                    setOrders(data?.data?.shop.orders)
                }
            })
        }
    }, [user, router])





    const handleStatusSelected = (status: React.ChangeEvent<HTMLInputElement>) => {
        console.log(status.target.value);
        router.push({
            pathname: router.asPath.split('?')[0],
            query: {
                statusOrder: status.target.value,
                page: 1
            }
        })
    }
    const handlePage = (page: number) => {
        console.log(page);
        router.push({
            pathname: router.asPath.split('?')[0],
            query: {
                statusOrder: router.query.statusOrder,
                page: page
            }
        })
    }

    return (
        <Desktop_Layout>
            <NoIndexSeo title={`Ordini | Veplo Shop`} />
            {data?.shop &&
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    mb={4}
                >

                    <ShopInfoSection shop={data?.shop} />
                    <Select
                        size={['sm', 'md']}
                        my={'auto'}
                        mb={0}
                        onChange={(option: any) => { handleStatusSelected(option) }}
                        fontSize={['xs', 'md']}
                        width={'fit-content'}
                        value={router.query.statusOrder}

                    >
                        {typeStatus.map((option: { text: string, statuses: string[] | null }) => {
                            return (<option
                                key={option.text} value={option.text}>{option.text}</option>)
                        })}
                    </Select>
                </Box>
            }


            {orders &&
                <>
                    <TableOrdersShop orders={orders} />
                    {orders.length > 0 && <Pagination page={parseInt(typeof router.query.page === 'string' ? router.query.page : '1')} handlePage={handlePage} />}
                </>
            }

        </Desktop_Layout >
    )
}

export default index