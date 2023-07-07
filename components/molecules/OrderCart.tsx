import { Box, Text } from '@chakra-ui/react'
import Link from 'next/link';
import React, { FC } from 'react'
import { Order } from '../../src/interfaces/order.interface'
import { STATUS } from '../mook/statusOrderUser';
import { formatNumberWithTwoDecimals } from '../utils/formatNumberWithTwoDecimals';
import { getDateFromMongoDBDate } from '../utils/getDateFromMongoDBDate';


const OrderCart: FC<{ order: Order }> = ({ order }) => {




    return (
        <Link
            prefetch={false}
            href={'/orders/' + order.id}
        >

            <Box
                padding={10}
                borderWidth={1}
                borderColor={'gray.300'}
                borderRadius={'2xl'}
                _active={{
                    transform: 'scale(0.99)',
                }}
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
                        >Ordine del {getDateFromMongoDBDate(order.createdAt)}</Text>

                    </Box>
                    <Box
                        fontSize={'md'}
                        fontWeight={'bold'}
                    >
                        {formatNumberWithTwoDecimals(Number(order.totalDetails.total))}€
                    </Box>
                </Box>
                <Box
                    mt={12}
                    display={'flex'}
                    justifyContent={'space-between'}

                >
                    <Text
                        my={'auto'}
                        alignItems={'start'}
                        verticalAlign={'baseline'}
                        fontSize={'lg'}
                        fontWeight={'semibold'}
                    >
                        {STATUS.find(status => status.code === order.status) ? STATUS.find(status => status.code === order.status)?.text : ''}
                    </Text>


                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 my-auto mb-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Box>
            </Box>
        </Link>

    )
}

export default OrderCart