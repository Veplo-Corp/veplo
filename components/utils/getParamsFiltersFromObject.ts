import { ProductsFilter } from "../../src/pages/[prodotti]/[...slug]";

export const getParamsFiltersFromObject = (filters: ProductsFilter): Omit<ProductsFilter, "macroCategory" | "gender" | "microCategory"> => {
    const { macroCategory, gender, microCategory, ...newFilters } = filters;

    return newFilters;

}