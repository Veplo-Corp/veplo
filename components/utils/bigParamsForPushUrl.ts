import { ProductFiltersResponse } from "../../src/lib/apollo/generated/graphql";

export interface InputObjectBIG {
    macroCategory: string | null | undefined;
    microCategory: string | null | undefined;
    filters: {
        brand?: string;
        colors?: string[];
        keywords?: string[];
        maxPrice?: number;
        minPrice?: number;
        query?: string;
        sizes?: string[];
        univers?: string;
    };
}

export const processBIGObjectForUrl = (
    input: ProductFiltersResponse
): InputObjectBIG | false => {
    const {
        brand,
        colors,
        keywords,
        macroCategory,
        maxPrice,
        //! non usare microcategory per adesso
        //microCategory,
        minPrice,
        query,
        sizes,
        univers,
    } = input;

    // Controlla se almeno uno dei valori non è null o undefined
    if (
        brand === null &&
        colors === null &&
        keywords === null &&
        macroCategory === null &&
        maxPrice === null &&
        microCategory === null &&
        minPrice === null &&
        query === null &&
        sizes === null &&
        univers === null
    ) {
        return false;
    }

    // Crea un nuovo oggetto con solo i valori non null o non undefined
    const filters: InputObjectBIG["filters"] = {};

    if (brand !== null) {
        filters.brand = brand;
    }
    if (colors !== null) {
        filters.colors = colors;
    }
    if (keywords !== null) {
        filters.keywords = keywords;
    }
    if (maxPrice !== null) {
        filters.maxPrice = maxPrice;
    }
    if (minPrice !== null) {
        filters.minPrice = minPrice;
    }
    if (query !== null) {
        filters.query = query;
    }
    if (sizes !== null) {
        filters.sizes = sizes;
    }
    if (univers !== null) {
        filters.univers = univers;
    }

    // Crea l'oggetto di output
    const output: InputObjectBIG = {
        macroCategory,
        //microCategory,
        microCategory: null,
        filters,
    };

    return output;
};

