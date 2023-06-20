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

interface FilterParameters {
    name: 'macroCategory' | 'microCategory' | 'minPrice' | 'maxPrice' | 'colors' | 'fit' | 'traits' | 'length' | 'materials' | 'sizes',
    parameters: undefined | number[] | string[] | Color[],
    value: string | number | undefined | null
}


const FiltersSelections: FC<{ filters: ProductsFilter, handleConfirmChange: (value: string, filterParameter: string) => void, typeProducts: 'abbigliamento' | 'accessori', changePriceEventRouter: (parameters: { name: string, value: any }[]) => void }> = ({ filters, handleConfirmChange, typeProducts, changePriceEventRouter }) => {

    const isSmallView = useBreakpointValue({ base: true, md: false });



    //TODO creare interface
    const [filterParameters, setFilterParameters] = useState<FilterParameters[]>()
    const [drawerFilterOpen, setDrawerFilterOpen] = useState(false)
    const [filterCount, setFilterCount] = useState(0)

    filterCount
    const router = useRouter()
    useEffect(() => {
        if (!router.isReady) return

        console.log(filters.gender);
        const gender = filters.gender === 'm' ? 'uomo' : 'donna';
        //TODO inserire logica per accessori
        if (typeProducts === 'accessori') return

        const categories = CATEGORIES[gender][typeProducts];
        let parsedFilter: FilterParameters[] = [
            {
                name: "minPrice",
                parameters: undefined,
                value: filters.minPrice
            },
            {
                name: "maxPrice",
                parameters: undefined,
                value: filters.maxPrice
            },

        ];

        //ricerca categoryObject della categoria selezionata
        const categoryObject = categories.find(category => category.name.toLowerCase() === filters.macroCategory?.toLowerCase())

        //gestione caso non ci sia macroCategory selezionata
        if (!categoryObject) {
            const types: Color[] | undefined = COLORS_TYPES.find(colorsType => colorsType.name.toLowerCase() === 'clothes_colors')?.type
            if (types) {
                parsedFilter.push({
                    name: 'colors',
                    parameters: types.map(type => {
                        return type.name
                    }),
                    value: filters.colors?.[0] ? filters.colors?.[0] : undefined
                })
            }

            parsedFilter.push({
                name: 'macroCategory',
                parameters: categories.map(category => {
                    return category.name
                }),
                value: undefined
            })

            return setFilterParameters(parsedFilter)
        }

        //inserire i campi per ogni filtro applicabile
        if (categoryObject.types) {
            parsedFilter.push({
                name: 'microCategory',
                parameters: categoryObject.types,
                value: filters.microCategory
            })
        }
        if (typeof categoryObject.fit === 'string') {
            const categoryObjectFit: string = categoryObject.fit
            const types: string[] | undefined = FIT_TYPES.find(fitType => fitType.name.toLowerCase() === categoryObjectFit.toLowerCase())?.type
            if (types) {
                //TODO inserire anche fit
                parsedFilter.push({
                    name: 'fit',
                    parameters: types,
                    value: null
                })
            }
        }
        if (typeof categoryObject.length === 'string') {
            const categoryObjectLength: string = categoryObject.length

            const types: string[] | undefined = LENGTH_TYPES.find(lengthType => lengthType.name.toLowerCase() === categoryObjectLength.toLowerCase())?.type
            if (types) {
                //TODO inserire anche length
                parsedFilter.push({
                    name: 'length',
                    parameters: types,
                    value: null
                })
            }
        }
        if (typeof categoryObject.materials === 'string') {
            const categoryObjectMaterials: string = categoryObject.materials

            const types: string[] | undefined = MATERIALS_TYPES.find(materialsType => materialsType.name.toLowerCase() === categoryObjectMaterials.toLowerCase())?.type
            if (types) {
                //TODO inserire anche materials
                parsedFilter.push({
                    name: 'materials',
                    parameters: types,
                    value: null
                })
            }
        }
        if (typeof categoryObject.traits === 'string') {
            const categoryObjectTraits: string = categoryObject.traits
            const types: string[] | undefined = TRAITS_TYPES.find(materialsType => materialsType.name.toLowerCase() === categoryObjectTraits.toLowerCase())?.type
            if (types) {
                //TODO inserire anche traits
                parsedFilter.push({
                    name: 'traits',
                    parameters: types,
                    value: null
                })
            }
        }

        if (typeof categoryObject.colors === 'string') {
            const categoryObjectColors: string = categoryObject.colors
            const types: Color[] | undefined = COLORS_TYPES.find(colorsType => colorsType.name.toLowerCase() === categoryObjectColors.toLowerCase())?.type
            if (types) {
                parsedFilter.push({
                    name: 'colors',
                    parameters: types.map(type => {
                        return type.name
                    }),
                    value: filters.colors?.[0] ? filters.colors?.[0] : undefined
                })
            }
        }

        if (typeof categoryObject.sizes === 'string') {
            const categoryObjectSizes: string = categoryObject.sizes

            let types: string[] | undefined = SIZES_TYPES.find(sizeType => sizeType.name.toLowerCase() === categoryObjectSizes.toLowerCase())?.type

            if (types) {
                types = types.map(type => {
                    return type.toLocaleUpperCase()
                })
                let defaultSize;
                const size0 = filters.sizes?.[0]
                if (size0) {
                    defaultSize = types.find(type => type.startsWith(size0.toLocaleUpperCase()))
                }
                parsedFilter.push({
                    name: 'sizes',
                    parameters: types,
                    value: defaultSize ? defaultSize : undefined
                })
            }
        }
        console.log(parsedFilter);
        setFilterParameters(parsedFilter)

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
            />
        </Box >

    )
}

export default FiltersSelections