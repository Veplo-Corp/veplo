import { Box, Button, Center, Divider, Tag, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../../components/atoms/Desktop_Layout';
import Loading from '../../../../../../components/molecules/Loading';
import ProductVariationInOrder from '../../../../../../components/molecules/ProductVariationInOrder';
import { OrderStatus, STATUS } from '../../../../../../components/mook/statusOrderUser';
import PriceAndShippingListingCost from '../../../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../../../components/utils/create_url';
import { imageKitUrl } from '../../../../../../components/utils/imageKitUrl';
import toUpperCaseFirstLetter from '../../../../../../components/utils/uppercase_First_Letter';
import { DateFormat, getDateFromMongoDBDate } from '../../../../../../components/utils/getDateFromMongoDBDate';
import ModalReausable from '../../../../../../components/organisms/ModalReausable';
import FormReturn from '../../../../../../components/molecules/FormReturn';
import { ToastOpen } from '../../../../../../components/utils/Toast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import RETURN_ORDER from '../../../../../lib/apollo/mutations/returnOrder';
import { setOrders } from '../../../../../store/reducers/orders';
import GrayBox from '../../../../../../components/atoms/GrayBox';
import Modal_Help_Customer_Care from '../../../../../../components/organisms/Modal_Help_Customer_Care';
import GET_LAST_ORDER_USER_FROM_SHOP from '../../../../../lib/apollo/queries/getLastOrderUserFromShop';
import { Order } from '../../../../../lib/apollo/generated/graphql';
import { Firebase_User } from '../../../../../interfaces/firebase_user.interface';
import ProfilePhoto from '../../../../../../components/molecules/ProfilePhoto';
import CheckoutProduct from '../../../../../../components/molecules/CheckoutProduct';
import OrderComponent from '../../../../../../components/molecules/OrderComponent';
import { fbq, gtag } from '../../../../../lib/analytics/gtag';
import { GTMEventType, PixelEventType } from '../../../../../lib/analytics/eventTypes';
import { formatNumberWithTwoDecimalsInNumber } from '../../../../../../components/utils/formatNumberWithTwoDecimalsInNumber';
import { GtagVariationsToItemsFor } from '../../../../../../components/utils/GtagVariationsToItemsFor';





const index = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const orders: Order[] = useSelector((state: any) => state.orders.orders);

    const { loading, data, error } = useQuery(GET_LAST_ORDER_USER_FROM_SHOP, {
        variables: {
            shopId: router.query.shopId + '',
            userId: router.query.userId + '',
        }

    });



    const [order, setOrder] = useState<Order>();
    const [orderStatus, setOrderStatus] = useState<OrderStatus>();



    useEffect(() => {
        //64b8eb28cd7ef52c053c954a

        if (!router.isReady) return
        const { shopId, userId } = router.query;
        if ((typeof shopId !== 'string' || typeof userId !== 'string')) return

        // getOrder({
        //     variables: {
        //         shopId: shopId,
        //         userId: userId,
        //     }
        // })

    }, [router.query])



    useEffect(() => {

        if (!data || !data?.lastOrderFromShopByUser || order) return
        setOrder(data?.lastOrderFromShopByUser)
        purchase(data?.lastOrderFromShopByUser)
        handleStatus(data?.lastOrderFromShopByUser?.status)
    }, [data])

    const purchase = (order: Order | undefined) => {
        if (!order) return
        const items = GtagVariationsToItemsFor(order?.productVariations)
        if (items.length <= 0) return

        gtag({
            command: GTMEventType.purchase,
            args: {
                email: order.user?.email,
                ecommerce: {
                    transaction_id: order?.id,
                    currency: 'EUR',
                    value: formatNumberWithTwoDecimalsInNumber(typeof order?.totalDetails?.total === 'number' ? order?.totalDetails?.total : 0),
                    shipping: formatNumberWithTwoDecimalsInNumber(typeof order?.totalDetails?.amountShipping === 'number' ? order?.totalDetails?.amountShipping : 0),
                    //TODO coupon
                    coupon: order.totalDetails?.amountDiscount ? 'COUPON' : undefined,
                    items: [
                        ...items
                    ]
                }

            }
        })
        fbq({
            command: PixelEventType.purchase,
            args: {
                value: formatNumberWithTwoDecimalsInNumber(typeof order?.totalDetails?.total === 'number' ? order?.totalDetails?.total : 0),
                currency: 'EUR'
            },
            eventID: {
                eventID: order?.id ? order?.id : ''
            }
        })
    }




    const handleStatus = (orderStatus: string | undefined | null) => {
        if (!orderStatus) return
        const status = STATUS.find(status => status.code === orderStatus);
        if (!status) return
        setOrderStatus({
            text: status.text,
            color: status.color,
            background: status.background
        })
    }


    return (
        <Desktop_Layout>
            {order ? (
                <div
                    className='w-full md:w-11/12 lg:w-3/4 xl:w-7/12 m-auto md:mt4'
                >

                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        mb={3}
                    >
                        <Link
                            href={'/negozio/' + order.shop?.id + '/' + createUrlSchema([order?.shop?.name ? order?.shop?.name : ''])}
                        >
                            <ProfilePhoto
                                imgName={order?.shop?.name}
                                scr={order?.shop?.photo}
                                primaryText={order?.shop?.name}
                                secondaryText={'#' + order.code}
                            />
                        </Link>


                        <Text
                            my={'auto'}
                            fontWeight={['semibold', 'medium']}
                            fontSize={['13px', '15px']}

                            color={'#909090'}
                        >
                            {getDateFromMongoDBDate(order.createdAt, DateFormat.onlyDate)}
                        </Text>
                    </Box>
                    <OrderComponent
                        order={order}
                        orderStatus={orderStatus}
                    />




                </div>
            ) :
                (
                    <Box className='h-[60vh] md:h-[50vh] lg:h-[70vh] xl:h-[75vh]'
                        display={'flex'}
                        justifyContent={'center'}>
                        <Loading />
                    </Box>
                )
            }

        </Desktop_Layout>

    )
}

export default index