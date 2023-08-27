import { Box, Input, InputGroup, Text, useEventListenerMap } from '@chakra-ui/react'
import { Listbox, Transition } from '@headlessui/react'
import { Euro, NavArrowDown } from 'iconoir-react'
import React, { FC, Fragment, useEffect, useState } from 'react'

const SelectMaxMinPrice: FC<{ defaultValue: { minPrice: any, maxPrice: any }, handleChange: (minPrice: any, maxPrice: any) => void }> = ({ defaultValue, handleChange }) => {
    const [price, setPrice] = useState<{ minPrice: any, maxPrice: any }>()


    useEffect(() => {


        if (defaultValue) {
            setPrice({
                minPrice: defaultValue.minPrice ? defaultValue.minPrice / 100 : undefined,
                maxPrice: defaultValue.maxPrice ? defaultValue.maxPrice / 100 : undefined,
            })
        }
    }, [defaultValue])



    const handleEvent = () => {
        if (defaultValue.minPrice !== price?.minPrice || defaultValue.maxPrice !== price?.maxPrice) {
            handleChange(price?.minPrice, price?.maxPrice)
        }
    }



    return (
        <Listbox>
            <div className={`z-1 relative border border-[#F3F3F3]  h-12 w-fit rounded-[10px]`}>
                <Listbox.Button
                    onFocus={handleEvent}
                    className={`${(price?.maxPrice || price?.minPrice) ? 'bg-black text-white' : 'bg-white text-[#3A3A3A]'} cursor-pointer  min-w-[100px] md:min-w-[70px] h-full  w-full border-none rounded-[10px] pl-3 pr-9 leading-5 bg-white   font-md font-semibold focus:ring-0`}>
                    {price?.minPrice || price?.maxPrice ? (
                        <>
                            da {price?.minPrice ? price?.minPrice + '€' : 0}{price?.maxPrice ? ` a ${price?.maxPrice}€` : ''}
                        </>
                    ) : (
                        <>
                            prezzo
                        </>
                    )
                    }
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <NavArrowDown
                            className={`h-5 w-5 ${price?.maxPrice || price?.minPrice ? '' : 'text-gray-400'} `}
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options
                        className=" z-10 bg-white absolute mt-1 max-h-44 min-w-[180px] w-fit overflow-auto rounded-md bg-whitetext-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            gap={3}
                            p={4}
                        >
                            <Box>
                                <Text
                                    fontWeight={'bold'}
                                    fontSize={'sm'}
                                    color={'secondaryBlack.text'}
                                    mb={1}
                                >
                                    Minimo
                                </Text>
                                <InputGroup
                                    bg={'#F2F2F2'}
                                    variant={'grayPrimary'}
                                    px={2}
                                    borderRadius={'md'}
                                >

                                    <Input
                                        fontSize={'md'}
                                        fontWeight={'medium'}
                                        onWheel={(e: any) => e.target.blur()}
                                        _placeholder={{
                                            fontWeight: '450',
                                            color: '#A19F9F'
                                        }}
                                        bg={'#F2F2F2'}
                                        variant={'grayPrimary'}
                                        px={0}
                                        pr={'2px'}
                                        minW={'10'}
                                        type='number'
                                        defaultValue={typeof price?.minPrice === 'number' ? price?.minPrice : undefined}
                                        onChange={(e) => {

                                            if (!e.target.value) {
                                                setPrice((preveState: any) => {
                                                    return {
                                                        ...preveState,
                                                        minPrice: undefined
                                                    }
                                                })
                                                return
                                            }
                                            setPrice((preveState: any) => {
                                                return {
                                                    ...preveState,
                                                    minPrice: parseInt(e.target.value, 10)
                                                }
                                            })
                                        }}
                                    />
                                    <Euro
                                        strokeWidth={2}
                                        className='my-auto'
                                    />
                                </InputGroup>
                            </Box>
                            <Box>
                                <Text
                                    fontWeight={'bold'}
                                    fontSize={'sm'}
                                    color={'secondaryBlack.text'}
                                    mb={1}
                                >
                                    Massimo
                                </Text>
                                <InputGroup
                                    bg={'#F2F2F2'}
                                    variant={'grayPrimary'}
                                    px={2}
                                    borderRadius={'md'}
                                >

                                    <Input
                                        fontSize={'md'}
                                        fontWeight={'medium'}
                                        onWheel={(e: any) => e.target.blur()}
                                        _placeholder={{
                                            fontWeight: '450',
                                            color: '#A19F9F'
                                        }}
                                        bg={'#F2F2F2'}
                                        variant={'grayPrimary'}
                                        px={0}
                                        pr={'2px'}
                                        minW={'10'}
                                        type='number'
                                        defaultValue={typeof price?.maxPrice === 'number' ? price?.maxPrice : undefined}
                                        onChange={(e) => {
                                            if (!e.target.value) {
                                                setPrice((preveState: any) => {
                                                    return {
                                                        ...preveState,
                                                        maxPrice: undefined
                                                    }
                                                })
                                                return
                                            }
                                            setPrice((preveState: any) => {
                                                return {
                                                    ...preveState,
                                                    maxPrice: parseInt(e.target.value, 10)
                                                }
                                            })
                                        }}
                                    />
                                    <Euro
                                        strokeWidth={2}
                                        className='my-auto'
                                    />
                                </InputGroup>
                            </Box>
                        </Box>

                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox >
    )
}

export default SelectMaxMinPrice