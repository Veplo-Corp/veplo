import { Avatar, Box, Center, Text, useBreakpointValue } from '@chakra-ui/react'
import Link from 'next/link';
import React, { FC } from 'react'
import { Order } from '../../src/interfaces/order.interface'
import { STATUS } from '../mook/statusOrderUser';
import { formatNumberWithTwoDecimals } from '../utils/formatNumberWithTwoDecimals';
import { DateFormat, getDateFromMongoDBDate } from '../utils/getDateFromMongoDBDate';
import { imageKitUrl } from '../utils/imageKitUrl';
import ProfilePhoto from './ProfilePhoto';


const OrderCart: FC<{ order: Order }> = ({ order }) => {
    const isSmallView = useBreakpointValue({ base: true, md: false });




    return (
        <Link
            prefetch={false}
            href={'/orders/' + order.id}
        >
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                mb={3}
            >
                <ProfilePhoto
                    imgName={order.shop.name}
                    scr={order.shop.photo}
                    primaryText={order.shop.name}
                    secondaryText={'#' + order.code}
                />

                <Text
                    my={'auto'}
                    fontWeight={['semibold', 'medium']}
                    fontSize={['13px', '15px']}

                    color={'#909090'}
                >
                    {getDateFromMongoDBDate(order.createdAt, DateFormat.onlyDate)}
                </Text>
            </Box>

            <Box
                borderWidth={1}
                borderColor={'#F3F3F3'}
                borderRadius={'15px'}
                _active={{
                    transform: 'scale(0.99)',
                }}
                display={'flex'}
                width={'full'}
                height={64}
                alignItems={'center'}
            >
                <Box
                    pl={5}
                    width={isSmallView ? 'full' : '50%'}

                >
                    <Box
                        display={'flex'}
                    >
                        <img loading='lazy'
                            className='h-36 rounded-[10px] z-10'
                            src={imageKitUrl(order.productVariations?.[0].photo)}
                        />
                        {order.productVariations?.[1]?.photo && <img loading='lazy'
                            className='my-auto h-28 rounded-[10px] z-0 -ml-24'
                            src={imageKitUrl(order.productVariations?.[1].photo)}
                        />}

                        {order?.productVariations?.length > 2 && <Text
                            ml={5}
                            my={'auto'}
                            fontWeight={'bold'}
                            fontSize={'18px'}

                            color={'#909090'}
                        >
                            + altri {order.productVariations.length - 1} prodotti
                        </Text>}
                        {order?.productVariations?.length === 2 && <Text
                            ml={5}
                            my={'auto'}
                            fontWeight={'bold'}
                            fontSize={'18px'}

                            color={'#909090'}
                        >
                            + 1 prodotto
                        </Text>}
                    </Box>
                    <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        height={'full'}
                        mt={5}
                    >
                        <Box
                            width={52}
                            textAlign={'center'}

                            paddingY={2}
                            borderRadius={'10px'}
                            bgColor={STATUS.find(status => status.code === order.status)?.background}
                            fontSize={'17px'}
                            color={STATUS.find(status => status.code === order.status)?.color}
                            fontWeight={'semibold'}
                        >
                            {STATUS.find(status => status.code === order.status)?.text}
                        </Box>
                        <Text
                            my="auto"
                            fontWeight="semibold"
                            fontSize="16px"
                            color={"#2A2A2A"}
                            mr={5}
                        >
                            {formatNumberWithTwoDecimals(order?.totalDetails?.total)}€
                        </Text>
                    </Box>


                </Box>
                {!isSmallView &&
                    <>
                        <Box
                            marginY={5}
                            minH='48'
                            className="w-[1px]
                     bg-[#F3F3F3]"
                        ></Box>
                        <Box
                            width={'50%'}
                            pl={6}
                            pr={4}
                        >
                            {order.history.filter(order => order.status !== 'SHIP01').slice(-3).map((singleOrder, index) => (
                                <React.Fragment key={index}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                    >
                                        <Text
                                            fontWeight="bold"
                                            fontSize="17px"
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
                                    {order.history.filter(order => order.status !== 'SHIP01').slice(-3).length > index + 1 && index !== 2 && ( // Aggiungi il divider solo se non è l'ultimo elemento
                                        <div className="ml-2 h-4 border-l border-dashed border-[#909090] my-2" />
                                    )}
                                </React.Fragment>
                            ))}
                        </Box>
                    </>

                }

            </Box>
        </Link>

    )
}

export default OrderCart