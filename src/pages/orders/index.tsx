import { Box, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Desktop_Layout from '../../../components/atoms/Desktop_Layout'
import OrderCart from '../../../components/molecules/OrderCart'
import { useSelector } from 'react-redux';
import { Order } from '../../interfaces/order.interface';
import Loading from '../../../components/molecules/Loading';


const index = () => {

    const orders: Order[] = useSelector((state: any) => state.orders.orders);


    return (
        <>
            {orders ? (
                <Box
                    className='min-h-[100vh] w-[95%] sm:w-11/12 md:w-11/12 lg:w-9/12 2xl:w-6/12 m-auto mt-4 md:mt-8'
                >
                    <VStack
                        gap={8}
                        width={'full'}
                    >

                        {orders.map((order, index) => {
                            return (
                                <div key={index} className='w-full'>
                                    <OrderCart order={order} />
                                </div>
                            )
                        })}
                    </VStack>

                </Box>

            ) :
                (
                    <Loading />
                )
            }
        </>

    )
}

export default index