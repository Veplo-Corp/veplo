import { Box, Input, InputGroup, Text } from '@chakra-ui/react'
import { Listbox, Transition } from '@headlessui/react'
import { Euro, NavArrowDown } from 'iconoir-react'
import React, { FC, Fragment, useState } from 'react'

const SelectMaxMinPrice: FC<{ defaultValue?: { minPrice: number, maxPrice: number }, handleChange: (value: any) => void }> = ({ defaultValue, handleChange }) => {
    const [price, setPrice] = useState<{ minPrice: string, maxPrice: string }>()

    return (
        <Listbox >
            <div className={`z-1 relative mt-1 border border-gray rounded-lg min-h-[50px]`}>
                <Listbox.Button className="cursor-default min-w-[100px] md:min-w-[140px] min-h-[45px] w-full border-none py-3.5 rounded-lg pl-3 pr-10 leading-5 text-gray-900 focus:ring-0">
                    {price?.minPrice || price?.maxPrice ? (
                        <>
                            da {price?.minPrice ? price?.minPrice : 0}{price?.maxPrice ? `a ${price?.maxPrice}` : '`'}
                        </>
                    ) : (
                        <>
                            Prezzo
                        </>
                    )
                    }
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <NavArrowDown
                            className="h-5 w-5 text-gray-400"
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
        </Listbox>
    )
}

export default SelectMaxMinPrice