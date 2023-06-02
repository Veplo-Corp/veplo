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
import { Shop } from '../../../../../interfaces/shop.interface';
import { addShopFavouriteToLocalStorage } from '../../../../../../components/utils/shop_localStorage';
import { addFavouriteShopBusiness } from '../../../../../store/reducers/user';
import ShopInfoSection from '../../../../../../components/molecules/ShopInfoSection';


const limit = 1000;

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
        statuses: ["RET01", "RET02", "REF02"]
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
    const [hasMoreData, setHasMoreData] = useState(false)
    useEffect(() => {
        const { shopId, statusOrder } = router.query

        if (user?.isBusiness && shopId && statusOrder) {
            const status = typeStatus.find(status => status.text === statusOrder)?.statuses
            console.log(status);
            //setOrders([])
            setHasMoreData(true)
            getOrders({
                variables: {
                    id: shopId,
                    statuses: status,
                    limit: limit,
                    offset: 0
                }
            }).then((data: any) => {
                console.log(data);

                if (data?.data?.shop?.orders) {
                    if (data?.data?.shop.orders.length % limit === 0) {
                        setHasMoreData(true)
                    } else {
                        setHasMoreData(false)
                    }
                    setOrders(data?.data?.shop.orders)
                }
            })
        }
    }, [user, router])



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
            if (!element?.data?.shop.orders) return
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

    const handleStatusSelected = (status: React.ChangeEvent<HTMLInputElement>) => {
        console.log(status.target.value);
        router.push({
            pathname: router.asPath.split('?')[0],
            query: {
                statusOrder: status.target.value
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


            {orders && <TableOrdersShop orders={orders} moreData={hasMoreData} handleMoreOrders={handleMoreOrders} />}
        </Desktop_Layout >
    )
}

export default index