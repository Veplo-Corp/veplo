import { Box, Text } from '@chakra-ui/react'
import Link from 'next/link';
import React, { FC } from 'react'
import { Order } from '../../src/interfaces/order.interface'


const OrderCart: FC<{ order: Order }> = ({ order }) => {
    console.log(new Date(+order.createdAt));




    return (
        <Box
            padding={10}
            borderWidth={1}
            borderColor={'gray.300'}
            borderRadius={'2xl'}
        >
            <Box
                display={'flex'}
                justifyContent={'space-between'}
            >
                <Box>
                    <Text
                        fontSize={'lg'}
                        fontWeight={'semibold'}
                    >{order.shop.name}</Text>
                    <Text
                        fontSize={'sm'}
                        fontWeight={'normal'}
                        mt={-1}
                    >Ordine del {('0' + new Date(+order.createdAt).getDay()).slice(-2)}/{('0' + (new Date(+order.createdAt).getMonth() + 1)).slice(-2)}/{new Date(+order.createdAt).getFullYear()}</Text>

                </Box>
                <Box
                    fontSize={'md'}
                    fontWeight={'bold'}
                >
                    {(order.totalDetails.total / 100).toFixed(2).replace('.', ',')} €
                </Box>
            </Box>
            <Box
                mt={12}
                display={'flex'}
                justifyContent={'space-between'}

            >
                <Text
                    my={'auto'}
                    mb={0}
                    alignItems={'start'}
                    justifyContent={'end'}
                    verticalAlign={'baseline'}
                    fontSize={'lg'}
                    fontWeight={'semibold'}
                >In elaborazione (manca)
                </Text>

                <Link
                    href={'/orders/' + order.id}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </Box>
        </Box>
    )
}

export default OrderCart