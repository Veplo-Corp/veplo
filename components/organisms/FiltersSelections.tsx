import React, { FC, useEffect, useState } from 'react'
import { ProductsFilter } from '../../src/pages/[prodotti]/[...slug]'
import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import SelectOption from '../atoms/SelectOption';
import { Filter, NavArrowRight } from 'iconoir-react';
import DrawerFilter from './DrawerFilter';
import SelectMaxMinPrice from '../atoms/SelectMaxMinPrice';
import { FilterParameters, findParsedFilter } from '../utils/findParsedFilter';
import BrandsFilter from '../atoms/BrandsFilter';
import ToogleComponent from '../atoms/ToogleComponent';
import { FilterAccepted } from '../atoms/TagFilter';
import { VeploGTMEvent } from '../../src/lib/analytics/eventTypes';
import { Univers } from '../mook/categories';




const FiltersSelections: FC<{ filters: ProductsFilter, filterDrawerConfirm: (value: ProductsFilter | undefined) => void, handleConfirmChange: (value: string, filterParameter: FilterAccepted) => void, univers: Univers | undefined, changePriceEventRouter: (parameters: { name: string, value: any }[]) => void, handleChangeMacroCategory: (value: string) => void }> = ({ filters, handleConfirmChange, univers, changePriceEventRouter, filterDrawerConfirm, handleChangeMacroCategory }) => {

    const isSmallView = useBreakpointValue({ base: true, md: false });
    //TODO creare interface
    const [filterParameters, setFilterParameters] = useState<FilterParameters[]>()
    const [drawerFilterOpen, setDrawerFilterOpen] = useState(false)
    const [filterCount, setFilterCount] = useState(0)
    const router = useRouter();

    if (!univers) return (
        <></>
    )



    useEffect(() => {
        if (!router.isReady) return

        //crea l'oggetto filtri applicati
        const parsedFilter = findParsedFilter(filters, univers)
        console.log(parsedFilter);

        if (!parsedFilter) return
        return setFilterParameters(parsedFilter)

    }, [filters])

    const handleChange = (value: string, filterParameter: FilterAccepted) => {
        if (!value) return
        handleConfirmChange(value, filterParameter)
    }


    const changePriceEvent = (minPrice: number | undefined | null | string, maxPrice: number | undefined | null | string) => {
        let parameters: { name: string, value: number | undefined | null | string }[] = [];

        if (typeof minPrice === 'number') {
            parameters.push({
                name: 'minPrice',
                value: minPrice * 100
            })
        }

        if (typeof maxPrice === 'number') {
            parameters.push({
                name: 'maxPrice',
                value: maxPrice * 100
            })
        }
        if (parameters.length <= 0) return
        changePriceEventRouter(parameters)

    }

    const handleConfirmModalFilter = (filters: ProductsFilter | undefined) => {
        filterDrawerConfirm(filters)
        return setDrawerFilterOpen(false)
    }



    return (
        <Box
            display={'flex'}
        >
            {!isSmallView && <Box
                display={'flex'}
                gap={2}
                mb={2}
                mr={2}
            >
                {
                    filterParameters?.find(parameter => parameter.name === 'macroCategory') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'macroCategory')?.parameters}
                        defaultValue={filterParameters?.find(parameter => parameter.name === 'macroCategory')?.value}
                        placeholder={'categoria'}
                        handleClick={(value) => handleChange(value, 'macroCategory')}
                    />
                }
                {
                    filterParameters?.find(parameter => parameter.name === 'sizes') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'sizes')?.parameters}
                        defaultValue={filterParameters?.find(parameter => parameter.name === 'sizes')?.value}
                        placeholder={'taglie'}
                        handleClick={(value) => handleChange(value, 'sizes')}
                    />
                }
                {
                    filterParameters?.find(parameter => parameter.name === 'colors') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'colors')?.parameters}
                        defaultValue={filterParameters?.find(parameter => parameter.name === 'colors')?.value}
                        placeholder={'colore'}
                        handleClick={(value) => handleChange(value, 'colors')}
                    />
                }
                {/* {
                    filterParameters?.find(parameter => parameter.name === 'microCategory') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'microCategory')?.parameters}
                        defaultValue={
                            filterParameters?.find(parameter => parameter.name === 'microCategory')?.value ?
                                filterParameters?.find(parameter => parameter.name === 'microCategory')?.value :
                                undefined

                        }
                        placeholder={'micro categoria'}
                        handleClick={(value) => handleChange(value, 'microCategory')}
                    />
                } */}
                {/* <BrandsFilter
                    handleChangeValues={(value: string) => {
                        handleChange(value, 'brand')
                    }}
                    selectedValue={filters.brand}
                    placeholder='brand'
                /> */}
                <SelectMaxMinPrice handleChange={changePriceEvent}
                    defaultValue={{
                        minPrice: filterParameters?.find(parameter => parameter.name === 'minPrice')?.value,
                        maxPrice: filterParameters?.find(parameter => parameter.name === 'maxPrice')?.value
                    }}
                />
                <ToogleComponent
                    modifyToogleInComponent={true}
                    value={filterParameters?.find(parameter => parameter.name === 'sale')?.value === 'true' ?
                        true :
                        undefined
                    }
                    handleChangeToogle={(value) => {
                        handleChange(value, 'sale')
                    }}
                />




                {/* {
                    filterParameters?.find(parameter => parameter.name === 'fit') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'fit')?.parameters}
                        defaultValue={filterParameters?.find(parameter => parameter.name === 'fit')?.value}
                        placeholder={'fit'}
                        handleClick={(value) => handleChange(value, 'fit')}
                    />
                }
                {
                    filterParameters?.find(parameter => parameter.name === 'materials') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'materials')?.parameters}
                        defaultValue={filterParameters?.find(parameter => parameter.name === 'materials')?.value}
                        placeholder={'materiali'}
                        handleClick={(value) => handleChange(value, 'materials')}
                    />
                }
                {
                    filterParameters?.find(parameter => parameter.name === 'length') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'length')?.parameters}
                        defaultValue={filterParameters?.find(parameter => parameter.name === 'length')?.value}
                        placeholder={'lunghezza'}
                        handleClick={(value) => handleChange(value, 'length')}
                    />
                }
                {
                    filterParameters?.find(parameter => parameter.name === 'traits') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'traits')?.parameters}
                        defaultValue={filterParameters?.find(parameter => parameter.name === 'traits')?.value}
                        placeholder={'tipologia'}
                        handleClick={(value) => handleChange(value, 'traits')}
                    />
                } */}

            </Box>}
            {isSmallView && <Button
                height={12}
                variant={['grayPrimary', 'whiteButton']}
                gap={1}
                paddingX={4}
                borderRadius={'10px'}
                onClick={() => {
                    {
                        console.log('eccolo');
                        setDrawerFilterOpen(true)
                    }
                }}
            >
                <>
                    <Filter
                        className='w-6 h-6'
                        strokeWidth={2.5}
                    />
                    {filterCount > 0 && <Text
                        fontSize={'lg'}
                        fontWeight={'semibold'}
                    >
                        {filterCount}
                    </Text>}
                </>
            </Button>}
            {!isSmallView && <Button
                height={12}
                variant={['grayPrimary', 'whiteButton']}
                gap={1}
                paddingX={4}
                borderRadius={'10px'}
                onClick={() => {
                    {
                        console.log('eccolo');
                        setDrawerFilterOpen(true)
                    }
                }}
            >
                <Text
                    fontSize={'md'}
                    fontWeight={'semibold'}
                >
                    più filtri
                </Text>
                <NavArrowRight
                    className='w-5 h-5 text-gray-400'
                    strokeWidth={1.5}

                />
            </Button>}
            <DrawerFilter
                isOpenDrawer={drawerFilterOpen}
                closeDrawer={() => {
                    setDrawerFilterOpen(false)
                }}
                handleConfirm={handleConfirmModalFilter}
                filtersProps={filters}
                univers={univers}
                changeMacroCategory={handleChangeMacroCategory}
            />
        </Box >

    )
}

export default FiltersSelections