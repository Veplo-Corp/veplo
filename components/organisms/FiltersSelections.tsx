import React, { FC, useEffect, useState } from 'react'
import { ProductsFilter } from '../../src/pages/[prodotti]/[...slug]'
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { CATEGORIES } from '../mook/categories';
import { FIT_TYPES } from '../mook/productParameters/fit';
import { LENGTH_TYPES } from '../mook/productParameters/length';
import { MATERIALS_TYPES } from '../mook/productParameters/materials';
import { TRAITS_TYPES } from '../mook/productParameters/traits';
import { COLORS_TYPES } from '../mook/productParameters/colors';
import { Color } from '../mook/colors';
import SelectOption from '../atoms/SelectOption';

const FiltersSelections: FC<{ filters: ProductsFilter, handleConfirm: () => void, typeProducts: 'abbigliamento' | 'accessori' }> = ({ filters, handleConfirm, typeProducts }) => {


    //TODO creare interface
    const [filterParameters, setFilterParameters] = useState<{ name: string, parameters: undefined | number[] | string[] | Color[], value: string | number | undefined | null }[]>()

    const router = useRouter()
    useEffect(() => {

        if (!router.isReady) return
        console.log(filters.gender);
        const gender = filters.gender === 'm' ? 'uomo' : 'donna';
        //TODO inserire logica per accessori
        if (typeProducts === 'accessori') return


        const categories = CATEGORIES[gender][typeProducts];
        let parsedFilter: { name: string, parameters: undefined | number[] | string[] | Color[], value: string | number | undefined | null }[] = [
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
                    parameters: types,
                    value: filters.colors?.[0] ? filters.colors?.[0] : undefined
                })
            }
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
                    parameters: types,
                    value: filters.colors?.[0] ? filters.colors?.[0] : undefined
                })
            }
        }
        console.log(parsedFilter);
        setFilterParameters(parsedFilter)



    }, [filters])




    return (
        <Box
            display={'flex'}
            gap={2}
            mb={2}
        >
            {
                filterParameters?.find(parameter => parameter.name === 'microCategory') &&
                <SelectOption
                    values={filterParameters?.find(parameter => parameter.name === 'microCategory')?.parameters}
                    defaultValue={filterParameters?.find(parameter => parameter.name === 'microCategory')?.value}
                    placeholder={'categoria'}
                    handleClick={() => { }}
                />
            }
        </Box>
    )
}

export default FiltersSelections