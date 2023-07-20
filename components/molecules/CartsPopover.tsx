import React, { FC, Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Box, Center, Divider, Tag, Text, VStack, useBreakpointValue } from '@chakra-ui/react'
import { NavArrowRight, Shop, ShoppingBag } from 'iconoir-react'
import { useSelector } from 'react-redux'
import { Cart } from '../../src/lib/apollo/generated/graphql'
import ProfilePhoto from './ProfilePhoto'
import { useRouter } from 'next/router'
import { formatNumberWithTwoDecimalsInString } from '../utils/formatNumberWithTwoDecimalsInString'
import Link from 'next/link'


const CartsPopover: FC<{ numberOfProductsInCarts: number }> = ({ numberOfProductsInCarts }) => {
    const router = useRouter()
    const cartsDispatch: Cart[] = useSelector((state: any) => state.carts.carts);
    const isSmallView = useBreakpointValue({ base: true, sm: false });




    return (
        <Popover className="relative">
            <Popover.Button
                type='button'
                aria-label="user"
                className='bg-[#F2F2F2] rounded-[10px] p-2'
            >
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 my-auto">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg> */}
                <ShoppingBag
                    strokeWidth={2}
                    className="w-6 h-6 my-auto"
                />
                {numberOfProductsInCarts > 0 &&
                    <Tag
                        position={'absolute'}
                        borderRadius={'full'}
                        bg={'primary.bg'}
                        color={'primary.text'}
                        className='-top-2 -right-2.5'
                    >
                        <Text
                            fontSize={['xs', 'sm']}
                            mx={'auto'}
                            fontWeight={'bold'}
                        >
                            {numberOfProductsInCarts}
                        </Text>

                    </Tag>}
            </Popover.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-400"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >

                <Popover.Panel
                    style={{
                        boxShadow: "0px 0px 20px 0px rgba(144, 144, 144, 0.25)",
                    }}
                    className="absolute cursor-pointer z-10 w-[300px] sm:w-[400px] md:w-[550px] mt-2 right-0 sm:right-0.5 p-3 bg-white border border-gray-200 rounded-[20px]">
                    {({ close }) => (
                        <>
                            {cartsDispatch.length > 0 ?
                                (
                                    <VStack
                                        width={'full'}
                                        gap={[3]}
                                    >
                                        {cartsDispatch.map((cart, id) => {
                                            const totalQuantity = cart?.productVariations && cart?.productVariations.reduce(
                                                (acc, variation) => acc + (variation?.quantity || 0),
                                                0)

                                            return (
                                                <Link
                                                    href={'/checkout/' + cart.shopInfo?.id}
                                                    className='w-full'
                                                    onClick={() => close()}
                                                >
                                                    <Box
                                                        _active={{
                                                            transform: 'scale(0.99)',
                                                        }}
                                                        p={4}
                                                        py={3}
                                                        borderColor={'#F3F3F3'}
                                                        borderRadius={'15px'}
                                                        borderWidth={'1px'}

                                                        width={'full'}
                                                        key={id}
                                                        display={'flex'}
                                                        justifyContent={'space-between'}
                                                    >
                                                        <ProfilePhoto
                                                            imgName={cart?.shopInfo?.name}
                                                            scr={cart.shopInfo?.profilePhoto}
                                                            primaryText={cart.shopInfo?.name}
                                                            secondaryText={cart.shopInfo?.name}
                                                        />
                                                        <Box
                                                            display={['flex']}
                                                            gap={[0.5, 1]}
                                                        >
                                                            <Text
                                                                my={'auto'}
                                                                color={'#909090'}
                                                                fontSize={['12px', '14px']}
                                                                fontWeight={'medium'}
                                                            >
                                                                {totalQuantity} Prodott{totalQuantity === 1 ? 'o' : 'i'}
                                                            </Text>
                                                            {!isSmallView &&
                                                                <>
                                                                    <Center height='20px' my={'auto'} mx={1}>
                                                                        <Divider orientation='vertical' />
                                                                    </Center>
                                                                    <Text
                                                                        my={'auto'}
                                                                        color={'primaryBlack.text'}
                                                                        fontSize={['12px', '14px']}
                                                                        fontWeight={'medium'}
                                                                    >
                                                                        {formatNumberWithTwoDecimalsInString(cart?.total ? cart?.total : 0)}€
                                                                    </Text>
                                                                    <NavArrowRight

                                                                        className='w-8 h-8 my-auto ml-2'
                                                                        strokeWidth={1}
                                                                    />
                                                                </>
                                                            }
                                                        </Box>
                                                    </Box>
                                                </Link>

                                            )
                                        })}
                                    </VStack>
                                )
                                :
                                (
                                    <Text
                                        fontSize={'lg'}
                                        fontWeight={'semibold'}
                                        color={'#909090'}
                                        p={5}
                                        py={3}
                                    >
                                        carrello vuoto...
                                    </Text>
                                )
                            }
                        </>


                    )}



                </Popover.Panel>
            </Transition>

        </Popover >
    )
}

export default CartsPopover