import React, { FC, useEffect, useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Image,
    Box,
    TagLabel,
    Tag,
    Tooltip,
    Text,
    Badge,
    Stack,
    Center,
} from '@chakra-ui/react'
import { Order } from '../../src/interfaces/order.interface'
import { STATUS_ORDER_SHOP } from '../mook/statusOrderBusiness';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { DateFormat, getDateFromMongoDBDate } from '../utils/getDateFromMongoDBDate';
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString';



const TableOrdersShop: FC<{ orders: Order[] | undefined }> = ({ orders }) => {
    const router = useRouter()
    return (
        <TableContainer className='flex m-auto w-full '>
            <Table variant='simple'>
                <TableCaption
                    marginBottom={0}
                >
                    <Text>
                        {orders ? 'i tuoi ordini in Veplo' : 'nessun ordine trovato'}
                    </Text>


                </TableCaption>
                <Thead
                    bg={'gray.100'}
                >
                    <Tr
                    >
                        <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            ORDINE
                        </Th>
                        {!isMobile && <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            CLIENTE
                        </Th>}
                        {!isMobile && <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            PAGAMENTO
                        </Th>}
                        <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            TOTALE
                        </Th>
                        {!isMobile && <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            DATA CREAZIONE
                        </Th>}
                        <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            STATUS
                        </Th>
                        <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >

                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {orders && orders.map((order) => {
                        const status = STATUS_ORDER_SHOP.find(status => status.code === order.status)
                        return (
                            <Tr
                                onClick={() => {
                                    router.push(`/shop/home/${order.shop.id}/ordini/${order.id}`)
                                }}
                                cursor={'pointer'}
                                key={order.id}
                                fontSize={['xs', 'medium']}
                                height={[14, 16]}
                                _hover={{
                                    background: 'gray.50'
                                }}
                            >
                                <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}
                                >
                                    <Text
                                        fontWeight={'semibold'}
                                    >
                                        {order.code.toLocaleUpperCase()}
                                    </Text>
                                </Td>
                                {!isMobile && <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}
                                >
                                    <Text
                                        fontWeight={'normal'}
                                    >
                                        {order.recipient.name}
                                    </Text>
                                </Td>}
                                {!isMobile && <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}
                                >
                                    <Tag
                                        className='m-auto md:m-0'
                                        mx={'auto'}
                                        px={2}
                                        py={1}
                                        borderRadius={'full'}
                                        size={['xs', 'md']}
                                        colorScheme={status ? status?.payment.color : 'red'}
                                    >
                                        {status ? status?.payment.text : 'Errore'}
                                    </Tag>
                                </Td>}
                                <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}
                                >
                                    <Text
                                        fontWeight={'normal'}
                                    >
                                        {formatNumberWithTwoDecimalsInString(order?.totalDetails?.total)} €
                                    </Text>
                                </Td>
                                {!isMobile && <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}

                                >
                                    <Text
                                        fontWeight={'normal'}
                                    >
                                        {getDateFromMongoDBDate(order.createdAt, DateFormat.onlyDate)}
                                    </Text>
                                </Td>}
                                <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}
                                >

                                    <Badge colorScheme={status ? status.orderStatus.color : 'red'}>
                                        {status ? status.orderStatus.text : 'Errore'}
                                    </Badge>
                                </Td>
                                <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}
                                    cursor={'pointer'}

                                >

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 my-auto">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>

                                </Td>
                            </Tr>
                        )
                    })}



                </Tbody>


            </Table>

        </TableContainer>
    )
}

export default TableOrdersShop