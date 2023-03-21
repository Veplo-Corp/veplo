import { Box, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import createUrlSchema from '../../../../components/utils/create_url';
import { imageKitUrl } from '../../../../components/utils/imageKitUrl';
import toUpperCaseFirstLetter from '../../../../components/utils/uppercase_First_Letter';
import { Order } from '../../../interfaces/order.interface';

const index = () => {
    const router = useRouter()
    const orders: Order[] = useSelector((state: any) => state.orders.orders);
    const [order, setOrder] = useState<Order>()

    useEffect(() => {
        const { orderId } = router.query
        if (!orderId) return
        setOrder(orders.filter(order => order.id === orderId)[0])
    }, [router?.query, orders])

    console.log(order);


    return (
        <Desktop_Layout>
            {order && <div
                className='w-full md:w-7/12 xl:w-1/2 m-auto mt-4 md:mt-16'
            >
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
                            Terni, via cavour 41 (manca)
                        </Text>
                    </Box>

                </Box>
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    width={'full'}
                    mt={[5, 3]}
                >
                    <Box
                        width={'full'}
                    >
                        <VStack
                            width={'full'}
                            gap={4}
                        >
                            {order.productVariations.map((variation, index) => {
                                return (
                                    <div
                                        className='flex gap-4 justify-between w-full'
                                        key={index}
                                    >
                                        <Box
                                            display={'flex'}
                                        >
                                            <LazyLoadImage src={
                                                imageKitUrl(variation.photo, 171, 247)
                                            }
                                                //PlaceholderSrc={PlaceholderImage}
                                                alt={variation.name}
                                                className='w-20'
                                            />
                                            <Box
                                                paddingLeft={3}

                                                justifyContent={'space-between'}
                                            >
                                                <Box
                                                    fontSize={'normal'}
                                                    fontWeight={'medium'}
                                                >
                                                    {toUpperCaseFirstLetter(variation.name)} ({variation.color})
                                                </Box>
                                                <Box
                                                    fontSize={'xs'}
                                                    fontWeight={'light'}
                                                    color={'gray.500'}
                                                    mt={-1}
                                                >
                                                    {toUpperCaseFirstLetter('Lacoste (Manca)')}
                                                </Box>
                                                <Box
                                                    fontSize={'xs'}
                                                    fontWeight={'normal'}
                                                >
                                                    {variation.size.toUpperCase()} / Quantità {variation.quantity}
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Link
                                            href={'/home'}
                                            target="_blank"
                                            className='text-lg font-bold h-fit'

                                        >
                                            Traccia il<br />mio pacco
                                        </Link>
                                    </div>

                                )
                            })}
                        </VStack>

                    </Box>
                </Box>
            </div>}
        </Desktop_Layout>
    )
}

export default index