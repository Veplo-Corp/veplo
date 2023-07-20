import { Box, Button, Center, Divider, Tag, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../../components/atoms/Desktop_Layout';
import Loading from '../../../../../components/molecules/Loading';
import ProductVariationInOrder from '../../../../../components/molecules/ProductVariationInOrder';
import { OrderStatus, STATUS } from '../../../../../components/mook/statusOrderUser';
import PriceAndShippingListingCost from '../../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../../components/utils/create_url';
import { imageKitUrl } from '../../../../../components/utils/imageKitUrl';
import toUpperCaseFirstLetter from '../../../../../components/utils/uppercase_First_Letter';
import { DateFormat, getDateFromMongoDBDate } from '../../../../../components/utils/getDateFromMongoDBDate';
import ModalReausable from '../../../../../components/organisms/ModalReausable';
import FormReturn from '../../../../../components/molecules/FormReturn';
import { ToastOpen } from '../../../../../components/utils/Toast';
import { useMutation, useQuery } from '@apollo/client';
import RETURN_ORDER from '../../../../lib/apollo/mutations/returnOrder';
import { setOrders } from '../../../../store/reducers/orders';
import GrayBox from '../../../../../components/atoms/GrayBox';
import Modal_Help_Customer_Care from '../../../../../components/organisms/Modal_Help_Customer_Care';
import GET_ORDER from '../../../../lib/apollo/queries/getOrder';
import { Order } from '../../../../lib/apollo/generated/graphql';
import { Firebase_User } from '../../../../interfaces/firebase_user.interface';
import ProfilePhoto from '../../../../../components/molecules/ProfilePhoto';
import CheckoutProduct from '../../../../../components/molecules/CheckoutProduct';
import { formatNumberWithTwoDecimals } from '../../../../../components/utils/formatNumberWithTwoDecimals';
import OrderComponent from '../../../../../components/molecules/OrderComponent';
import { gtag } from '../../../../lib/analytics/gtag';
import { GTMEventType } from '../../../../lib/analytics/eventTypes';





const index = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const orders: Order[] = useSelector((state: any) => state.orders.orders);
    const { data } = useQuery<{ order: Order }>(GET_ORDER, {
        variables: {
            id: router.query.orderId
        }
    })

    const user: Firebase_User = useSelector((state: any) => state.user.user);

    const [order, setOrder] = useState<Order>();
    const [orderStatus, setOrderStatus] = useState<OrderStatus>();
    const [isOpenModalReturn, setIsOpenModalReturn] = useState(false)
    const { addToast } = ToastOpen();



    useEffect(() => {
        const { orderId } = router.query
        if (!data && !order) return
        setOrder(data?.order)
        purchase(data?.order)

        handleStatus(data?.order?.status)
    }, [data])

    const purchase = (order: Order | undefined) => {
        if (!order) return
        const items = order.productVariations?.map(variation => {


            const price = variation.quantity && variation.price?.v1 && variation.price?.v2 && variation.price?.v2 < variation.price?.v1 ?
                variation.price?.v2 * variation.quantity
                :
                variation.quantity && variation.price?.v1 && variation.price?.v2 && variation.price?.v2 >= variation.price?.v1 ?
                    variation.price?.v1 * variation.quantity
                    :
                    0


            return {
                item_id: variation.id,
                item_name: variation.name,
                discount: formatNumberWithTwoDecimals(variation.price?.v1 && variation.price?.v2 ? variation.price?.v1 - variation.price?.v2 : 0),
                item_brand: variation.brand,
                //TODO aggiungere a variation gender, univers, macrocategory, microcategory
                item_variant: variation.color,
                price: formatNumberWithTwoDecimals(price),
                quantity: variation.quantity
            }
        })
        if (!items) return

        gtag({
            command: GTMEventType.purchase,
            args: {
                email: order.user?.email,
                ecommerce: {
                    transaction_id: order?.id,
                    currency: 'EUR',
                    value: formatNumberWithTwoDecimals(typeof order?.totalDetails?.total === 'number' ? order?.totalDetails?.total : 0),
                    shipping: formatNumberWithTwoDecimals(typeof order?.totalDetails?.amountShipping === 'number' ? order?.totalDetails?.amountShipping : 0),
                    //TODO coupon
                    //coupon: "SUMMER_SALE",
                    items: [
                        ...items
                    ]
                }

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
        <>
            {order ? (
                <Desktop_Layout>
                    <div
                        className='w-full md:w-11/12 lg:w-8/12 xl:w-7/12 m-auto md:mt4'
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
                </Desktop_Layout >
            ) :
                (
                    <Box
                        minHeight={'100vh'}
                    >
                        <Loading />

                    </Box>
                )
            }

        </>

    )
}

export default index