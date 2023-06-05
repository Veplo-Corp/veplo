import React, { FC, useState } from 'react'
import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Cancel } from 'iconoir-react'
import ModalReausable from './ModalReausable'
import { PropsFilter, PropsOpenModal } from '../../src/pages/prodotti/[...slug]'
import { useRouter } from 'next/router'
import Circle_Color from '../atoms/Circle_Color'
import { COLORS } from '../mook/colors'
import toUpperCaseFirstLetter from '../utils/uppercase_First_Letter'
import SelectStringOption from '../atoms/SelectStringOption'
import SelectColor from '../atoms/SelectColor'
import { SIZES } from '../mook/sizes'

const DrawerFilter: FC<{ isOpenDrawer: boolean, closeDrawer: () => void, microcategoryTypes: string[], sizeProduct: string, microCategory: string }> = ({ isOpenDrawer, closeDrawer, microcategoryTypes, microCategory, sizeProduct }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState<PropsOpenModal>({
        orderBy: false,
        category: false,
        size: false,
        color: false,
        price: false,
        brand: false,
        fit: false
    });

    const [filter, setFilter] = useState<PropsFilter>({})

    return (
        <>
            <Drawer
                isOpen={isOpenDrawer}
                placement='bottom'
                size={'lg'}
                onClose={closeDrawer}
            >
                <DrawerOverlay
                />
                <DrawerContent
                    borderTopRadius={'3xl'}
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

                        <Button
                            borderRadius={'full'}
                            h={12}
                            w={12}
                            p={0}
                            variant={'grayPrimary'}
                            onClick={closeDrawer}
                        >
                            <Cancel
                                strokeWidth={2.8}
                                className='w-7 h-7'
                            />
                        </Button>

                    </DrawerHeader>
                    <DrawerBody
                        minH={'45vh'}
                    >
                        <Box
                        >

                            {microcategoryTypes.length > 0 &&
                                <Box
                                    display={'flex'}
                                    gap={2}
                                    mb={2}
                                >
                                    {microcategoryTypes.length > 0 && <SelectStringOption
                                        placeholder='Categoria'
                                        values={microcategoryTypes}
                                        defaultValue={''}
                                        handleClick={(microcategory: string) => {
                                            console.log(microcategory);

                                        }}
                                    />}
                                    {sizeProduct && sizeProduct.length && (sizeProduct === 'man_clothes_sizes' || sizeProduct === 'woman_clothes_sizes' || sizeProduct === 'shoes_sizes') && <SelectStringOption
                                        placeholder='Taglia'
                                        values={SIZES[sizeProduct].map(size => {
                                            return size.toLocaleUpperCase()
                                        })}
                                        defaultValue={''}
                                        handleClick={(microcategory: string) => {
                                            console.log(microcategory);

                                        }}
                                    />}
                                </Box>}
                            <Box
                                display={'flex'}
                                gap={2}
                                mb={3}
                            >
                                <SelectColor
                                    placeholder='Colore'
                                    colors={COLORS}
                                    defaultValue={''}
                                    handleClick={(color) => {
                                    }}
                                />

                            </Box>



                        </Box>
                        <Button
                            variant={'grayPrimary'}
                            px={20}
                            py={5}
                            fontSize={'sm'}
                        >
                            Resetta filtri
                        </Button>

                    </DrawerBody>
                </DrawerContent>
            </Drawer >


        </>


    )
}

export default DrawerFilter

/* 
{COLORS.map(element => {
                        return (
                            <Box
                                key={element.cssColor}
                                width={'full'}
                                _hover={{
                                    background: 'gray.100'
                                }}
                                background={element.name === router.query.colors ? 'gray.100' : 'white'}
                                p={2}
                                textAlign={'center'}
                                cursor={'pointer'}
                                borderRadius={'lg'}
                                fontSize={'md'}
                                fontWeight={'semibold'}
                                onClick={() => {
                                }
                                }
                            >
                                <div
                                    className='flex m-auto'
                                >
                                    <div className='my-auto mr-2'>
                                        <Circle_Color colors={[element.cssColor]} dimension={4} space={0} />

                                    </div>
                                    <Text
                                        my={'auto'}
                                    >
                                        {element.name}
                                    </Text>
                                </div>

                            </Box>)
                    })}

*/