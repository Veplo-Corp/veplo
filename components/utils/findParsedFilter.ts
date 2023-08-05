import { ProductsFilter } from "../../src/pages/[prodotti]/[...slug]";
import { FilterAccepted } from "../atoms/TagFilter";
import { CATEGORIES, Univers } from "../mook/categories";
import { Color } from "../mook/colors";
import { COLORS_TYPES } from "../mook/productParameters/colors";
import { FIT_TYPES } from "../mook/productParameters/fit";
import { LENGTH_TYPES } from "../mook/productParameters/length";
import { MATERIALS_TYPES } from "../mook/productParameters/materials";
import { SIZES_TYPES } from "../mook/productParameters/sizes";
import { TRAITS_TYPES } from "../mook/productParameters/traits";

export interface FilterParameters {
    name: FilterAccepted,
    parameters: undefined | number[] | string[] | Color[],
    value: string | number | undefined | null | boolean
}

export const findParsedFilter = (filters: ProductsFilter, univers: Univers): FilterParameters[] | undefined => {
    const gender = filters?.gender === 'm' ? 'uomo' : 'donna';
    if (!univers) return
    const categories = CATEGORIES[gender][univers];

    let parsedFilter: FilterParameters[] = [
        {
            name: "minPrice",
            parameters: undefined,
            value: filters?.minPrice
        },
        {
            name: "maxPrice",
            parameters: undefined,
            value: filters?.maxPrice
        },
        {
            name: "brand",
            parameters: undefined,
            value: filters?.brand
        },
        {
            name: "sale",
            parameters: undefined,
            value: filters?.sale
        },
        {
            name: "sostenibile",
            parameters: undefined,
            value: filters?.traits ? "true" : "false"
        },

    ]

    //ricerca categoryObject della categoria selezionata
    const categoryObject = categories.find(category => category.name.toLowerCase() === filters?.macroCategory?.toLowerCase())

    //gestione caso non ci sia macroCategory selezionata
    if (!categoryObject) {
        const types: Color[] | undefined = COLORS_TYPES.find(colorsType => colorsType.name.toLowerCase() === 'clothes_colors')?.type
        if (types) {
            parsedFilter.push({
                name: 'colors',
                parameters: types.map(type => {
                    return type.name
                }),
                value: filters?.colors?.[0] ? filters?.colors?.[0] : undefined
            })
        }

        parsedFilter.push({
            name: 'macroCategory',
            parameters: categories.map(category => {
                return category.name
            }),
            value: undefined
        })

        return parsedFilter
    }

    parsedFilter.push({
        name: 'macroCategory',
        parameters: categories.map(category => {
            return category.name
        }),
        value: filters?.macroCategory
    })

    //inserire i campi per ogni filtro applicabile
    if (categoryObject.types) {
        parsedFilter.push({
            name: 'microCategory',
            parameters: categoryObject.types,
            value: filters?.microCategory
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
                value: filters?.colors?.[0] ? filters?.colors?.[0] : undefined
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
            const size0 = filters?.sizes?.[0]
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

    return parsedFilter
}