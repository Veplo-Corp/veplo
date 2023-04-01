import { useLazyQuery } from '@apollo/client'
import { Box, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Desktop_Layout from '../../../../../../../components/atoms/Desktop_Layout'
import GrayBox from '../../../../../../../components/atoms/GrayBox'
import ProductVariationInOrder from '../../../../../../../components/molecules/ProductVariationInOrder'
import PriceAndShippingListingCost from '../../../../../../../components/organisms/PriceAndShippingListingCost'
import { Firebase_User } from '../../../../../../interfaces/firebase_user.interface'
import { Order } from '../../../../../../interfaces/order.interface'
import GET_SHOP_ORDERS from '../../../../../../lib/apollo/queries/shopOrders'

const index = () => {
    const [getOrders, { error, data }] = useLazyQuery(GET_SHOP_ORDERS);
    const router = useRouter()
    const user: Firebase_User = useSelector((state: any) => state.user.user);
    const [order, setOrder] = useState<Order>()

    useEffect(() => {
        const { shopId, orderId } = router.query
        if (user?.isBusiness || shopId) {

            getOrders({
                variables: {
                    id: shopId,
                    statuses: null
                }
            }).then(result => {
                const order = result.data.shop.orders.find((order: Order) => order.id === orderId)
                //console.log(order);
                setOrder(order)

            })
        }
    }, [user, router])

    return (
        <Desktop_Layout>
            <Box
                className='w-full md:w-3/4 lg:w-1/2 m-auto'
            >
                <GrayBox>
                    <Text
                        fontSize={'2xl'}
                        fontWeight={'semibold'}
                        mb={3}
                    >
                        Informazioni Utente
                    </Text>
                    <VStack
                        gap={1}
                        align='stretch'
                    >
                        <Box>
                            <Text
                                fontSize={'md'}
                                fontWeight={'medium'}
                                mb={-1}
                            >
                                Nome
                            </Text>
                            <Text
                                fontSize={'md'}
                                fontWeight={'normal'}
                            >
                                Nicolò Merlini
                            </Text>
                        </Box>
                        <Box>
                            <Text
                                fontSize={'md'}
                                fontWeight={'medium'}
                                mb={-1}
                            >
                                email
                            </Text>
                            <Text
                                fontSize={'md'}
                                fontWeight={'normal'}
                            >
                                nicolo.merlini@gmail.com
                            </Text>
                        </Box>

                    </VStack>
                </GrayBox>
            </Box>
            <Box
                className='w-full md:w-3/4 lg:w-1/2 m-auto mt-8'
            >
                <GrayBox>
                    <Text
                        fontSize={'2xl'}
                        fontWeight={'semibold'}
                        mb={3}
                    >
                        Dettaglio Spedizione
                    </Text>
                    <VStack
                        gap={1}
                        align='stretch'
                    >
                        <Box>
                            <Text
                                fontSize={'md'}
                                fontWeight={'medium'}
                                mb={-1}
                            >
                                Ordine
                            </Text>
                            <Text
                                fontSize={'md'}
                                fontWeight={'normal'}
                            >
                                AB123 | 19/02/2023
                            </Text>
                        </Box>
                        <Box>
                            <Text
                                fontSize={'md'}
                                fontWeight={'medium'}
                                mb={-1}
                            >
                                Pagamento
                            </Text>
                            <Text
                                fontSize={'md'}
                                fontWeight={'normal'}
                            >
                                Saldato
                            </Text>
                        </Box>
                        <Box>
                            <Text
                                fontSize={'md'}
                                fontWeight={'medium'}
                                mb={-1}
                            >
                                Indirizzo
                            </Text>
                            <Text
                                fontSize={'md'}
                                fontWeight={'normal'}
                            >
                                05100, Terni, via cavour 41
                            </Text>
                        </Box>
                        <Box>
                            <Text
                                fontSize={'md'}
                                fontWeight={'medium'}
                                mb={-1}
                            >
                                A chi consegnare
                            </Text>
                            <Text
                                fontSize={'md'}
                                fontWeight={'normal'}
                            >
                                Mario Rossi
                            </Text>
                        </Box>
                        <Box>
                            <Text
                                fontSize={'md'}
                                fontWeight={'medium'}
                                mb={-1}
                            >
                                Numero di telefono
                            </Text>
                            <Text
                                fontSize={'md'}
                                fontWeight={'normal'}
                            >
                                3403033922
                            </Text>
                        </Box>
                    </VStack>

                </GrayBox>
                {order &&
                    <Box
                        mb={8}
                    >
                        <VStack

                            mt={[6, 10]}
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
                    </Box>
                }
                <GrayBox>

                </GrayBox>
            </Box>
        </Desktop_Layout>
    )
}

export default index