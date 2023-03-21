import { Box, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import Desktop_Layout from '../../../components/atoms/Desktop_Layout'
import OrderCart from '../../../components/molecules/OrderCart'
import { useSelector } from 'react-redux';
import { Order } from '../../interfaces/order.interface';


const index = () => {

    const orders: Order[] = useSelector((state: any) => state.orders.orders);
    console.log(orders);


    return (
        <Desktop_Layout>
            <div
                className='w-full md:w-3/4 m-auto mt-16'
            >
                <VStack
                    gap={4}
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

            </div>

        </Desktop_Layout>
    )
}

export default index