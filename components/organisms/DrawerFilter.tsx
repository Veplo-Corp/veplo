import React, { FC, useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useBreakpointValue, useDisclosure, VStack } from '@chakra-ui/react'
import { Cancel } from 'iconoir-react'
import ModalReausable from './ModalReausable'
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
import { ProductsFilter } from '../../src/pages/[prodotti]/[...slug]'
import { FilterParameters, findParsedFilter } from '../utils/findParsedFilter'
import SelectOption from '../atoms/SelectOption'
import { FilterAccepted } from '../atoms/TagFilter'
import BrandsFilter from '../atoms/BrandsFilter'

const DrawerFilter: FC<{ isOpenDrawer: boolean, filtersProps: ProductsFilter, typeProducts: 'abbigliamento' | 'accessori', closeDrawer: () => void, handleConfirm: (filters: ProductsFilter | undefined) => void, changeMacroCategory: (value: string) => void }> = ({ isOpenDrawer, closeDrawer, filtersProps, typeProducts, handleConfirm, changeMacroCategory }) => {

    const isSmallView = useBreakpointValue({ base: true, lg: false });
    const router = useRouter();
    const [filterParameters, setFilterParameters] = useState<FilterParameters[]>()
    const [filters, setFilters] = useState<ProductsFilter>()

    useEffect(() => {
        if (!router.isReady) return

        //crea l'oggetto filtri applicati
        const parsedFilter = findParsedFilter(filtersProps, typeProducts)
        setFilters(filtersProps)
        if (!parsedFilter) return
        return setFilterParameters(parsedFilter)

    }, [filtersProps])

    const handleChange = (value: string, filterParameter: FilterAccepted) => {
        if (!value) return
        if (filterParameter === 'macroCategory') {
            changeMacroCategory(value)
        }
        //gestione array di stringhe
        if (filterParameter === 'colors' || filterParameter === 'sizes') {
            setFilters((prevState: any) => {
                return {
                    ...prevState,
                    [filterParameter]: [value]
                }
            })
        } else {
            setFilters((prevState: any) => {
                return {
                    ...prevState,
                    [filterParameter]: value.toLocaleLowerCase()
                }
            })
        }

    }







    const changePriceEvent = (minPrice: number | undefined | null | string, maxPrice: number | undefined | null | string) => {
        let parameters: any = {};
        if (minPrice) {
            parameters['minPrice'] = minPrice
        }
        if (maxPrice) {
            parameters['maxPrice'] = maxPrice
        }

        if (parameters.length <= 0) return
        setFilters((prevState: any) => {
            return {
                ...prevState,
                ...parameters
            }
        })
    }

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
                        <Box
                            className="flex flex-wrap mr-20"
                            gap={2}
                        >

                            {
                                filterParameters?.find(parameter => parameter.name === 'macroCategory') &&
                                <SelectOption
                                    values={filterParameters?.find(parameter => parameter.name === 'macroCategory')?.parameters}
                                    defaultValue={filters?.macroCategory}
                                    placeholder={'categoria'}
                                    handleClick={(value) => handleChange(value, 'macroCategory')}
                                />
                            }
                            {
                                filterParameters?.find(parameter => parameter.name === 'microCategory') &&
                                <SelectOption
                                    values={filterParameters?.find(parameter => parameter.name === 'microCategory')?.parameters}
                                    defaultValue={filters?.microCategory}
                                    placeholder={'micro categoria'}
                                    handleClick={(value) => handleChange(value, 'microCategory')}
                                />
                            }
                            {
                                filterParameters?.find(parameter => parameter.name === 'sizes') &&
                                <SelectOption
                                    values={filterParameters?.find(parameter => parameter.name === 'sizes')?.parameters}
                                    defaultValue={filters?.sizes?.[0].toUpperCase()}
                                    placeholder={'taglie'}
                                    handleClick={(value) => handleChange(value, 'sizes')}
                                />
                            }
                            {
                                filterParameters?.find(parameter => parameter.name === 'colors') &&
                                <SelectOption
                                    values={filterParameters?.find(parameter => parameter.name === 'colors')?.parameters}
                                    defaultValue={filters?.colors?.[0]}
                                    placeholder={'colore'}
                                    handleClick={(value) => handleChange(value, 'colors')}
                                />
                            }
                            {
                                filterParameters?.find(parameter => parameter.name === 'brand') &&
                                <BrandsFilter
                                    handleChangeValues={(value: string) => {
                                        handleChange(value, 'brand')
                                    }}
                                    selectedValue={filters?.brand}
                                    placeholder='brand'
                                />
                            }
                            <SelectMaxMinPrice handleChange={changePriceEvent}
                                defaultValue={{
                                    minPrice: filters?.minPrice,
                                    maxPrice: filters?.maxPrice
                                }}
                            />

                        </Box>
                        <ButtonGroup
                            mt={10}
                            width={'full'}
                        >
                            <Button
                                variant={'grayPrimary'}
                                px={20}
                                py={5}
                                fontSize={'sm'}
                                onClick={() => {
                                    setFilters(undefined)
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

                                    handleConfirm(filters)
                                    return
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

