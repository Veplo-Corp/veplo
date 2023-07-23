import { Box, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import { CATEGORIES } from '../mook/categories'
import { Disclosure, Tab, Transition } from '@headlessui/react'
import createUrlSchema from '../utils/create_url'
import { Firebase_User } from '../../src/interfaces/firebase_user.interface'
import { useSelector } from 'react-redux'
import { getFromLocalStorage } from '../utils/getFromLocalStorage'
import ButtonClose from '../atoms/ButtonClose'
import { Cancel, NavArrowRight, Search } from 'iconoir-react'

const DrawerSearchProducts: FC<{ isOpen: boolean, closeDrawer: () => void, onConfirmText: (text: string) => void }> = ({ isOpen, closeDrawer, onConfirmText }) => {

    const router = useRouter();
    const [textSearched, setTextSearched] = useState('')
    const onConfirm = (e: any) => {
        if (e.key === 'Enter' || e.key === undefined) {
            if (textSearched.trim().length <= 3) return
            onConfirmText(textSearched.toLowerCase().trim())
            setTextSearched('')
            closeDrawer()
        }
    }




    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement={'top'}
                size={'sm'}
                onClose={() => closeDrawer()}
            >

                <DrawerOverlay />
                <DrawerContent
                    borderBottomRadius={'3xl'}
                >
                    <DrawerHeader
                        color={'secondaryBlack.text'}
                        pt={5} px={6}
                        pb={2}
                        fontSize={'24px'} fontWeight={'extrabold'}
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <Text
                            marginY={'auto'}
                        >
                            Cerca
                        </Text>
                        <ButtonClose
                            handleEvent={() => closeDrawer()}
                        />
                    </DrawerHeader>
                    <DrawerBody
                        mt={2}
                        minH={'20vh'}
                    >
                        <InputGroup
                            className='relative w-full'
                        >
                            <Input
                                type='text'
                                value={textSearched}
                                maxLength={50}
                                borderWidth={1.5}
                                borderColor={'white'}

                                onKeyDown={onConfirm}
                                placeholder={'Tutto quello che ti interessa'}
                                _placeholder={{
                                    color: '#A19F9F',
                                    opacity: 1,
                                    fontWeight: '500'
                                }}
                                borderRadius={'30px'}
                                py={7}
                                pl={5}
                                size='lg'
                                fontSize={'lg'}
                                focusBorderColor='#F2F2F2'
                                _focus={{
                                    background: 'white',
                                }}
                                fontWeight={'semibold'}
                                bg={'#F2F2F2'}
                                onChange={(e) => setTextSearched(e.target.value)}
                            />
                            <InputRightElement
                                my={2.5}
                                mr={3}

                                className='cursor-pointer h-full'
                                color={'#A19F9F'}
                                onClick={onConfirm}
                                children={

                                    <Search
                                        className="w-6 h-6 my-auto"
                                        strokeWidth={2.5}
                                    />



                                }
                            />
                        </InputGroup>
                        {textSearched.length > 0 && <Box
                            mt={'15px'}
                            borderRadius={15}
                            px={2}
                            bg={'white'}
                            display={'flex'}
                            justifyContent={'space-between'}
                            cursor={'pointer'}
                            width={'full'}
                            onClick={onConfirm}
                        >
                            <Box>
                                <Text
                                    fontSize={'xs'}
                                    fontWeight={'medium'}
                                    textColor={'#909090'}
                                    lineHeight={1.1}
                                >
                                    Ricerca
                                </Text>
                                <Text
                                    fontSize={'md'}
                                    fontWeight={'semibold'}
                                >
                                    {textSearched}
                                </Text>
                            </Box>
                            <NavArrowRight
                                height={35}
                                width={35}
                                strokeWidth={1.5}
                                className='my-auto'
                            />
                        </Box>}
                    </DrawerBody>

                </DrawerContent>
            </Drawer>
        </>
    )
}

export default DrawerSearchProducts