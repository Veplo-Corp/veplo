import React, { FC, useEffect, useState } from 'react'
import { ProductsFilter } from '../../src/pages/[prodotti]/[...slug]'
import { Box, Button, Text, useBreakpointValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { CATEGORIES } from '../mook/categories';
import { FIT_TYPES } from '../mook/productParameters/fit';
import { LENGTH_TYPES } from '../mook/productParameters/length';
import { MATERIALS_TYPES } from '../mook/productParameters/materials';
import { TRAITS_TYPES } from '../mook/productParameters/traits';
import { COLORS_TYPES } from '../mook/productParameters/colors';
import { Color } from '../mook/colors';
import SelectOption from '../atoms/SelectOption';
import { SIZES_TYPES } from '../mook/productParameters/sizes';
import { Filter, NavArrowRight } from 'iconoir-react';
import DrawerFilter from './DrawerFilter';
import SelectMaxMinPrice from '../atoms/SelectMaxMinPrice';
import { FilterParameters, findParsedFilter } from '../utils/findParsedFilter';




const FiltersSelections: FC<{ filters: ProductsFilter, filterDrawerConfirm: (value: ProductsFilter | undefined) => void, handleConfirmChange: (value: string, filterParameter: string) => void, typeProducts: 'abbigliamento' | 'accessori', changePriceEventRouter: (parameters: { name: string, value: any }[]) => void }> = ({ filters, handleConfirmChange, typeProducts, changePriceEventRouter, filterDrawerConfirm }) => {

    const isSmallView = useBreakpointValue({ base: true, md: false });
    //TODO creare interface
    const [filterParameters, setFilterParameters] = useState<FilterParameters[]>()
    const [drawerFilterOpen, setDrawerFilterOpen] = useState(false)
    const [filterCount, setFilterCount] = useState(0)
    const router = useRouter()


    useEffect(() => {
        if (!router.isReady) return

        //crea l'oggetto filtri applicati
        const parsedFilter = findParsedFilter(filters, typeProducts)
        if (!parsedFilter) return
        console.log(parsedFilter);
        return setFilterParameters(parsedFilter)

    }, [filters])

    const handleChange = (value: string, filterParameter: string) => {
        if (!value) return
        handleConfirmChange(value, filterParameter)
    }


    const changePriceEvent = (minPrice: number | undefined | null | string, maxPrice: number | undefined | null | string) => {
        console.log(minPrice, maxPrice);
        let parameters: { name: string, value: number | undefined | null | string }[] = [];

        parameters.push({
            name: 'minPrice',
            value: minPrice
        })

        parameters.push({
            name: 'maxPrice',
            value: maxPrice
        })

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
                    filterParameters?.find(parameter => parameter.name === 'microCategory') &&
                    <SelectOption
                        values={filterParameters?.find(parameter => parameter.name === 'microCategory')?.parameters}
                        defaultValue={filterParameters?.find(parameter => parameter.name === 'microCategory')?.value}
                        placeholder={'micro categoria'}
                        handleClick={(value) => handleChange(value, 'microCategory')}
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
                <SelectMaxMinPrice handleChange={changePriceEvent}
                    defaultValue={{
                        minPrice: filterParameters?.find(parameter => parameter.name === 'minPrice')?.value,
                        maxPrice: filterParameters?.find(parameter => parameter.name === 'maxPrice')?.value
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
            {!isSmallView && filters.macroCategory && <Button
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
                typeProducts={typeProducts}
            />
        </Box >

    )
}

export default FiltersSelections