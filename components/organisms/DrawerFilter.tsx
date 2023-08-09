import React, { FC, useEffect, useState } from 'react'
import { Box, Button, ButtonGroup, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Text, useBreakpointValue, useDisclosure, VStack } from '@chakra-ui/react'

import { useRouter } from 'next/router'

import SelectMaxMinPrice from '../atoms/SelectMaxMinPrice'
import ButtonClose from '../atoms/ButtonClose'

import { FilterParameters, findParsedFilter } from '../utils/findParsedFilter'
import SelectOption from '../atoms/SelectOption'
import { FilterAccepted } from '../atoms/TagFilter'
import BrandsFilter from '../atoms/BrandsFilter'
import ToogleComponent from '../atoms/ToogleComponent'
import { Univers } from '../mook/categories'
import { gtag } from '../../src/lib/analytics/gtag'
import { GTMEventType } from '../../src/lib/analytics/eventTypes'
import { Leaf } from 'iconoir-react'
import { ProductsFilter } from '../../src/pages/cerca/[prodotti]/[...slug]'

const DrawerFilter: FC<{ isOpenDrawer: boolean, filtersProps: ProductsFilter, univers: Univers, closeDrawer: () => void, handleConfirm: (filters: ProductsFilter | undefined) => void, changeMacroCategory: (value: string, filters: ProductsFilter | undefined) => void }> = ({ isOpenDrawer, closeDrawer, filtersProps, univers, handleConfirm, changeMacroCategory }) => {

    const isSmallView = useBreakpointValue({ base: true, lg: false });
    const router = useRouter();
    const [filterParameters, setFilterParameters] = useState<FilterParameters[]>()
    const [filters, setFilters] = useState<ProductsFilter>()

    useEffect(() => {
        if (!router.isReady) return

        //crea l'oggetto filtri applicati
        const newFilter = { ...filtersProps }
        if (newFilter["traits"]) {
            delete newFilter["traits"]
            newFilter["sostenibile"] = 'true'
        }

        const parsedFilter = findParsedFilter(newFilter, univers)
        setFilters(newFilter)

        if (!parsedFilter) return
        return setFilterParameters(parsedFilter)

    }, [filtersProps])

    const handleChange = (value: string, filterParameter: FilterAccepted) => {

        if (!value) return
        if (filterParameter === 'macroCategory') {
            changeMacroCategory(value, filters)
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
        if (typeof minPrice === 'number') {
            parameters['minPrice'] = minPrice * 100
        }
        if (typeof maxPrice === 'number') {
            parameters['maxPrice'] = maxPrice * 100
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
                            className="flex flex-wrap mr-16"
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
                            <ToogleComponent
                                isLoading={false}
                                modifyToogleInComponent={true}
                                text={
                                    <Box display={'flex'} gap={'4px'}>
                                        <Leaf
                                            className='my-auto'
                                            height={'20px'}
                                            width={'20px'}
                                            strokeWidth={2.3}
                                        />
                                        <Text
                                            marginY={'auto'}
                                        >
                                            sostenibile
                                        </Text>
                                    </Box>
                                }
                                value={filters?.sostenibile
                                    === 'true' ? true : false}
                                toogleColor={'bg-[#37D1A9]'}
                                handleChangeToogle={(value) => {
                                    handleChange(value, 'sostenibile')
                                    if (value === 'true') {
                                        return gtag({
                                            command: GTMEventType.sustainable_button_or_toggle,
                                            args: {
                                                page_section: 'pagina prodotti'
                                            }
                                        })
                                    }
                                }}
                            />
                            <ToogleComponent
                                isLoading={false}
                                modifyToogleInComponent={true}
                                text={'promozioni'}
                                value={filters?.sale
                                    === 'true' ? true : false}
                                handleChangeToogle={(value) => {
                                    handleChange(value, 'sale')
                                    if (value === 'true') {
                                        return gtag({
                                            command: GTMEventType.discount_button_or_toggle,
                                            args: {
                                                page_section: 'pagina prodotti'
                                            }
                                        })
                                    }
                                }}
                            />

                        </Box>
                        <ButtonGroup
                            mt={10}
                            width={['full']}
                            mb={5}
                        >
                            <Button
                                variant={'grayPrimary'}
                                width={'full'}
                                fontSize={'sm'}
                                onClick={() => {
                                    setFilters(undefined)
                                }}
                            >
                                Resetta filtri
                            </Button>
                            <Button
                                variant={'primary'}
                                width={'full'}

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

