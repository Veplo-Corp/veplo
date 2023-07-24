import { ProductsFilter } from "../../src/pages/[prodotti]/[...slug]";

export const getParamsFiltersFromObject = (filters: ProductsFilter | undefined): Omit<ProductsFilter, "macroCategory" | "gender" | "microCategory"> | undefined => {
    if (!filters) return undefined
    const { macroCategory, gender, microCategory, ...newFilters } = filters;

    return newFilters;

}