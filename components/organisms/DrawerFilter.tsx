import React, { FC, useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useBreakpointValue, useDisclosure, VStack } from '@chakra-ui/react'
import { Cancel } from 'iconoir-react'
import ModalReausable from './ModalReausable'
import { PropsFilter, PropsOpenModal } from '../../src/pages/prodotti-old/[...slug]'
import { useRouter } from 'next/router'
import Circle_Color from '../atoms/Circle_Color'
import { COLORS } from '../mook/colors'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import SelectStringOption from '../atoms/SelectStringOption'
import SelectColor from '../atoms/SelectColor'
import { SIZES } from '../mook/sizes'
import SelectMaxMinPrice from '../atoms/SelectMaxMinPrice'
import ButtonClose from '../atoms/ButtonClose'
import Autocomplete from '../atoms/Autocomplete_Headless'

const DrawerFilter: FC<{ isOpenDrawer: boolean, closeDrawer: () => void }> = ({ isOpenDrawer, closeDrawer }) => {

    const isSmallView = useBreakpointValue({ base: true, lg: false });


    return (
        <>
            <Drawer
                isOpen={isOpenDrawer}
                placement={isSmallView ? 'bottom' : 'left'}
                size={isSmallView ? 'lg' : 'sm'}
                onClose={() => closeDrawer()}
            >
                <DrawerOverlay
                />
                <DrawerContent
                    borderTopRadius={isSmallView ? '3xl' : 'none'}
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
                            Filtri
                        </Text>
                        <ButtonClose
                            handleEvent={() => closeDrawer()}
                        />



                    </DrawerHeader>
                    <DrawerBody
                        minH={'45vh'}
                    >

                        <ButtonGroup
                            width={'full'}
                        >
                            <Button
                                variant={'grayPrimary'}
                                px={20}
                                py={5}
                                fontSize={'sm'}
                                onClick={() => {

                                }}
                            >
                                Resetta filtri
                            </Button>
                            <Button
                                variant={'primary'}
                                px={20}
                                py={5}
                                fontSize={'sm'}
                                onClick={() => {

                                }}
                            >
                                Conferma
                            </Button>
                        </ButtonGroup>



                    </DrawerBody>
                </DrawerContent>
            </Drawer >


        </>


    )
}

export default DrawerFilter

