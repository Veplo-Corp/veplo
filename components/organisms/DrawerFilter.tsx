import React, { FC, useEffect, useState } from 'react'
import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useDisclosure, VStack } from '@chakra-ui/react'
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

const DrawerFilter: FC<{ defaultFilter: PropsFilter, isOpenDrawer: boolean, closeDrawer: (filter: PropsFilter, microCategory: string | undefined) => void, microcategoryTypes: string[], sizeProduct: string, defaultMicroCategory: string }> = ({ defaultFilter, isOpenDrawer, closeDrawer, microcategoryTypes, defaultMicroCategory, sizeProduct }) => {
    const router = useRouter()
    // const [isOpen, setIsOpen] = useState<PropsOpenModal>({
    //     orderBy: false,
    //     category: false,
    //     size: false,
    //     color: false,
    //     price: false,
    //     brand: false,
    //     fit: false
    // });

    const [filter, setFilter] = useState<PropsFilter>({})
    const [microCategory, setMicroCategory] = useState<string>()

    useEffect(() => {

        setFilter(defaultFilter)
        setMicroCategory(defaultMicroCategory)
    }, [defaultFilter, defaultMicroCategory])

    console.log(microCategory);

    const sizeFilter = filter && filter.sizes ? filter.sizes[0] : ''


    return (
        <>
            <Drawer
                isOpen={isOpenDrawer}
                placement='bottom'
                size={'lg'}
                onClose={() => closeDrawer(filter, microCategory)}
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
                        <ButtonClose
                            handleEvent={() => closeDrawer(filter, microCategory)}
                        />



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
                                    {microcategoryTypes.length > 0 &&
                                        <SelectStringOption
                                            placeholder='Categoria'
                                            fit='fit'
                                            values={microcategoryTypes}
                                            defaultValue={microCategory}
                                            handleClick={(microcategory: string) => {
                                                if (!microcategory) return
                                                setMicroCategory(microcategory.toLowerCase())

                                            }}
                                        />}
                                    {sizeProduct && sizeProduct.length && (sizeProduct === 'man_clothes_sizes' || sizeProduct === 'woman_clothes_sizes' || sizeProduct === 'shoes_sizes') &&
                                        <SelectStringOption
                                            placeholder='Taglia'
                                            values={SIZES[sizeProduct].map(size => {
                                                return size.toLocaleUpperCase()
                                            })}
                                            fit='fit'
                                            //defaultValue={SIZES[sizeProduct].find((size) => { size.startsWith(filter?.sizes && typeof filter?.sizes[0] === 'string' ? filter?.sizes[0].toLocaleLowerCase() : 'l') })}
                                            defaultValue={
                                                sizeFilter !== '' ? SIZES[sizeProduct].find((size) => size.startsWith(sizeFilter.toLocaleLowerCase()))?.toLocaleUpperCase()
                                                    : ''
                                            }
                                            handleClick={(size: string) => {
                                                if (!size) return
                                                setFilter(prevstate => {
                                                    return {
                                                        ...prevstate,
                                                        sizes: [size.split(' ')[0].toLowerCase()]
                                                    }
                                                })
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
                                    fit='fit'
                                    defaultValue={filter.colors ? toUpperCaseFirstLetter(filter.colors[0]) : ''}
                                    handleClick={(color) => {
                                        setFilter(prevstate => {
                                            return {
                                                ...prevstate,
                                                colors: [color.toLowerCase()]
                                            }
                                        })
                                    }}
                                />
                                <SelectMaxMinPrice handleChange={() => { }} />
                            </Box>
                            {/* <Box
                                display={'flex'}
                                gap={2}
                                mb={2}
                            >

                                <Autocomplete
                                    placeholder='Brand'
                                    selectedValue={''}
                                    handleChangeValues={(brand: any) => {
                                        // // setValue('brand', brand);
                                        console.log(brand);

                                    }} />
                            </Box> */}

                        </Box>
                        <Button
                            variant={'grayPrimary'}
                            px={20}
                            py={5}
                            fontSize={'sm'}
                            onClick={() => {
                                setFilter({})
                                setMicroCategory('')
                            }}
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

