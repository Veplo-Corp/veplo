import { Box, Center, Divider, Tag, Text, VStack, useBreakpointValue } from '@chakra-ui/react'
import React, { FC } from 'react'
import CheckoutProduct from './CheckoutProduct'
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString'
import { Order } from '../../src/lib/apollo/generated/graphql'
import { OrderStatus, STATUS } from '../mook/statusOrderUser'
import Link from 'next/link'
import { DateFormat, getDateFromMongoDBDate } from '../utils/getDateFromMongoDBDate'

const OrderComponent: FC<{ order: Order, orderStatus: OrderStatus | undefined }> = ({ order, orderStatus }) => {
    const isSmallView = useBreakpointValue({ base: true, md: false });

    return (
        <Box
            bg={'#FFFFFF'}
            width={'full'}
            height={'full'}
            padding={5}
            borderWidth={1}
            borderRadius={'15px'}
            className='md:flex'
        >
            <Box
                width={['full', 'full', 'full', '90%']}
                min-height={'full'}
                position='relative'

            >
                <VStack

                    width={'full'}
                    gap={4}
                    mb={16}
                >
                    {order?.productVariations && order?.productVariations.map((variation, index) => {
                        return (
                            <div key={index} className='w-full'>
                                <CheckoutProduct
                                    variation={variation}
                                />
                            </div>
                        )
                    })}
                </VStack>
                <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    width={'full'}
                    className='md:absolute mt-4 md:mt-0'
                    bottom={0}
                >
                    {orderStatus &&
                        <Box
                            display={'flex'}
                        >

                            <Tag
                                className='m-auto md:m-0'
                                mt={[0, 4]}

                                px={4}
                                py={2}
                                borderRadius={'10px'}
                                size={'md'}
                                fontSize={['sm', 'md']}
                                color={orderStatus.color}
                                background={orderStatus.background}
                            >
                                {orderStatus.text}
                            </Tag>
                        </Box>
                    }
                    <Box
                        my={'auto'}
                        mb={0}
                        gap={5}

                    >
                        {order?.shipping?.url && order?.status?.includes('SHIP') && <Link
                            prefetch={false}
                            href={order?.shipping?.url?.startsWith("https://") ? order?.shipping?.url : "https://" + order?.shipping?.url}
                            target="_blank"
                            className='text-lg font-bold h-fit flex'

                        >
                            <Text
                                my={'auto'}
                                className='underline '
                                fontWeight={'bold'}
                                fontSize={'14px'}

                            >
                                monitora spedizione
                            </Text>
                        </Link>}
                    </Box>

                </Box>
            </Box>
            {isSmallView ? (
                <Divider
                    mt={4}
                    mb={5}
                    bg={'#F3F3F3'}
                />
            )
                : (
                    <Center height='300px' my={'auto'} mx={5}>
                        <Divider orientation='vertical' />
                    </Center>
                )
            }
            <Box
                width={'full'}
            >
                <Box


                >
                    {order?.history && order.history.filter(order => order.status !== 'SHIP01').map((singleOrder, index) => (
                        <React.Fragment key={index}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                            >
                                <Text
                                    fontWeight="bold"
                                    fontSize="15px"
                                >
                                    {STATUS.find(element => element.code === singleOrder.status)?.text}
                                </Text>
                                <Text
                                    my="auto"
                                    fontWeight="medium"
                                    fontSize="12px"
                                    color="#909090"
                                >
                                    {getDateFromMongoDBDate(singleOrder.date, DateFormat.completeDate)}
                                </Text>
                            </Box>
                            {order?.history?.filter(order => order.status !== 'SHIP01') && index < order?.history?.filter(order => order.status !== 'SHIP01').length - 1 && ( // Aggiungi il divider solo se non è l'ultimo elemento
                                <div className="ml-2 h-4 border-l border-dashed border-[#909090] my-2" />
                            )}

                        </React.Fragment>
                    ))}
                </Box>
                <Divider
                    mt={4}
                    mb={5}
                    bg={'#F3F3F3'}
                />
                <Box
                    display={'flex'}
                    width={'full'}
                    justifyContent={'space-between'}
                    mb={5}
                >
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'#909090'}
                    >
                        Destinatario
                    </Text>
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'secondaryBlack.text'}
                    >
                        {order?.recipient?.name}
                    </Text>
                </Box>
                <Box
                    display={'flex'}
                    width={'full'}
                    justifyContent={'space-between'}
                    mb={5}
                >
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'#909090'}
                    >
                        Indirizzo
                    </Text>
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'secondaryBlack.text'}
                    >
                        {order?.recipient?.address?.city} - {order?.recipient?.address?.line1}
                    </Text>
                </Box>
                <Divider
                    mt={4}
                    mb={5}
                    bg={'#F3F3F3'}
                />
                <Box
                    display={'flex'}
                    width={'full'}
                    justifyContent={'space-between'}
                    mb={5}
                >
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'#909090'}
                    >
                        Subtotale
                    </Text>
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'secondaryBlack.text'}
                    >
                        {formatNumberWithTwoDecimalsInString(order?.totalDetails?.subTotal ? order?.totalDetails?.subTotal : 0)}€
                    </Text>
                </Box>
                <Box
                    display={'flex'}
                    width={'full'}
                    justifyContent={'space-between'}
                    mb={5}
                >
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'#909090'}
                    >
                        Spedizione
                    </Text>
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'secondaryBlack.text'}
                    >
                        {order.totalDetails?.amountShipping ? formatNumberWithTwoDecimalsInString(order.totalDetails?.amountShipping) + '€' : 'gratis'}
                    </Text>
                </Box>
                {typeof order.totalDetails?.amountDiscount === 'number' &&
                    order.totalDetails?.amountDiscount > 0
                    && <Box
                        display={'flex'}
                        width={'full'}
                        justifyContent={'space-between'}
                        mb={5}
                    >
                        <Text
                            fontSize={'16px'}
                            fontWeight={'medium'}
                            color={'#909090'}
                        >
                            sconto aggiuntivo
                        </Text>
                        <Text
                            fontSize={'16px'}
                            fontWeight={'medium'}
                            color={'secondaryBlack.text'}
                        >
                            -{formatNumberWithTwoDecimalsInString(order.totalDetails?.amountDiscount) + '€'}
                        </Text>
                    </Box>}

                <Box
                    display={'flex'}
                    width={'full'}
                    justifyContent={'space-between'}
                >
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'#909090'}
                    >
                        Totale
                    </Text>
                    <Text
                        fontSize={'16px'}
                        fontWeight={'medium'}
                        color={'secondaryBlack.text'}
                    >
                        {typeof order.totalDetails?.total === 'number' ? formatNumberWithTwoDecimalsInString(order.totalDetails?.total) + '€' : 'errore'}
                    </Text>
                </Box>
            </Box>

        </Box>
    )
}

export default OrderComponent