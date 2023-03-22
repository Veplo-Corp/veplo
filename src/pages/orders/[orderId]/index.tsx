import { Box, Button, Tag, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import ProductVariationInOrder from '../../../../components/molecules/ProductVariationInOrder';
import PriceAndShippingListingCost from '../../../../components/organisms/PriceAndShippingListingCost';
import createUrlSchema from '../../../../components/utils/create_url';
import { imageKitUrl } from '../../../../components/utils/imageKitUrl';
import toUpperCaseFirstLetter from '../../../../components/utils/uppercase_First_Letter';
import { Order } from '../../../interfaces/order.interface';


const STATUS = [

    {
        code: 'paid',
        text: 'In preparazione',
        color: 'blackAlpha',
    },
    {
        code: 'pending',
        text: 'In preparazione',
        color: 'blackAlpha',
    },
    {
        code: 'shipped',
        text: 'Spedito',
        color: 'yellow',
    },
    {
        code: 'delivered',
        text: 'Consegnato',
        color: 'green',
    },
    {
        code: 'cancel',
        text: 'Rimborsato',
        color: 'green',
    },
    {
        code: 'pending due to return',
        text: 'In attesa di rimborso',
        color: 'yellow',
    },

]


const index = () => {
    const router = useRouter()
    const orders: Order[] = useSelector((state: any) => state.orders.orders);
    const [order, setOrder] = useState<Order>();
    const [orderStatus, setOrderStatus] = useState<{ text: string, color: string }>();

    useEffect(() => {
        const { orderId } = router.query
        if (!orderId) return
        const order = orders.filter(order => order.id === orderId)[0]
        setOrder(order)

        handleStatus(order?.status)
    }, [router?.query, orders])

    console.log(order);

    const handleStatus = (orderStatus: string) => {
        const status = STATUS.find(status => status.code === orderStatus);
        if (!status) return
        setOrderStatus({
            text: status.text,
            color: status.color
        })
    }

    return (
        <Desktop_Layout>
            {order && <div
                className='w-full md:w-7/12 xl:w-1/2 m-auto md:mt4'
            >
                {orderStatus &&
                    <Box
                        display={'flex'}
                    >
                        <Tag
                            className='m-auto md:m-0'
                            mt={[0, 4]}
                            mb={4}
                            px={4}
                            py={2}
                            borderRadius={'full'}
                            size={'lg'}

                            colorScheme={orderStatus.color}
                        >
                            {orderStatus.text}
                        </Tag>
                    </Box>
                }
                <Box
                    display={['', 'flex']}
                    justifyContent={'space-between'}

                >
                    <Box
                        mb={2}
                    >
                        <Text
                            fontWeight={'bold'}
                            fontSize={['md']}
                        >
                            Negozio
                        </Text>
                        <Text
                            fontWeight={'medium'}
                            fontSize={'md'}
                            mt={0}
                            mb={-1}
                        >
                            {order?.shop.name}
                        </Text>
                        <Link
                            href={'/negozio/' + order?.shop.id + '/' + createUrlSchema([order?.shop.name])}
                            className='text-sm font-semibold underline'
                        >
                            vai al negozio
                        </Link>
                    </Box>
                    <Box
                        mb={2}
                    >
                        <Text
                            fontWeight={'bold'}
                            fontSize={'md'}
                        >
                            Ordine effetuato
                        </Text>
                        <Text
                            fontWeight={'medium'}
                            fontSize={'md'}
                            mt={0}
                            mb={-1}
                        >
                            {('0' + new Date(+order.createdAt).getDay()).slice(-2)}/{('0' + (new Date(+order.createdAt).getMonth() + 1)).slice(-2)}/{new Date(+order.createdAt).getFullYear()}
                        </Text>
                    </Box>
                    <Box
                        mb={2}
                    >
                        <Text
                            fontWeight={'bold'}
                            fontSize={'md'}
                        >
                            Indirizzo consegna

                        </Text>
                        <Text
                            fontWeight={'medium'}
                            fontSize={'md'}
                            mt={0}
                            mb={-1}
                        >
                            {order.user.address.city} ({order.user.address.postalCode}), {order.user.address.line1}
                        </Text>
                    </Box>

                </Box>

                <Text>
                    {order.code}
                </Text>
                <VStack
                    mt={[6, 4]}
                    width={'full'}
                    gap={4}
                >
                    {order.productVariations.map((variation, index) => {
                        return (
                            <div key={index} className='w-full'>
                                <ProductVariationInOrder variation={variation} />

                            </div>


                        )
                    })}
                </VStack>
                <PriceAndShippingListingCost subTotal={order.totalDetails.total} total={order.totalDetails.total} shippingCost={order.totalDetails.amountShipping} />

                <Link
                    href={'/home'}
                    target="_blank"
                    className='text-lg font-bold h-fit flex'

                >
                    <Button
                        margin={'auto'}
                        width={'full'}
                        mt={5}

                    >

                        Traccia il mio pacco
                    </Button>

                </Link>



            </div>}
        </Desktop_Layout>
    )
}

export default index