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
} from '@chakra-ui/react'
import { Order } from '../../src/interfaces/order.interface'
import { STATUS_ORDER_SHOP } from '../mook/statusOrderBusiness';
import { useRouter } from 'next/router';

const TableOrdersShop: FC<{ orders: Order[] }> = ({ orders }) => {
    const router = useRouter()
    return (
        <TableContainer className='flex m-auto w-full '>

            <Table variant='simple'>
                <TableCaption
                    marginBottom={10}
                >i tuoi ordini in Veplo</TableCaption>
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
                        <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            CLIENTE
                        </Th>
                        <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            PAGAMENTO
                        </Th>
                        <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            TOTALE
                        </Th>
                        <Th
                            p={[2, 4]}
                            fontSize={'sm'}
                        >
                            CONSEGNA
                        </Th>
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
                    {orders.map((order) => {
                        const status = STATUS_ORDER_SHOP.find(status => status.code === order.status)
                        return (
                            <Tr
                                key={order.id}
                                fontSize={['xs', 'medium']}
                                height={[10, 16]}
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
                                <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}
                                >
                                    <Text
                                        fontWeight={'normal'}
                                    >
                                        {order.recipient.name}
                                    </Text>
                                </Td>
                                <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}
                                >
                                    <Tag
                                        className='m-auto md:m-0'
                                        mt={[0, 4]}
                                        mb={4}
                                        px={2}
                                        py={1}
                                        borderRadius={'full'}
                                        size={['xs', 'md']}
                                        colorScheme={status ? status?.payment.color : 'red'}
                                    >
                                        {status ? status?.payment.text : 'Errore'}
                                    </Tag>
                                </Td>
                                <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}

                                >
                                    <Text
                                        fontWeight={'normal'}
                                    >
                                        {order.totalDetails.total} €
                                    </Text>
                                </Td>
                                <Td
                                    paddingRight={0}
                                    paddingY={0}
                                    paddingLeft={[2, 4]}

                                >
                                    <Text
                                        fontWeight={'normal'}
                                    >
                                        {order.recipient.address.city}, {order.recipient.address.line1}
                                    </Text>
                                </Td>
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
                                    onClick={() => {
                                        router.push(`/shop/home/${order.shop.id}/ordini/${order.id}`)
                                    }}
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