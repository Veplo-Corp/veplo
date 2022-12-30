
const createFilterObject = (
    brands: any,
    minPrice: any,
    maxPrice: any,
    colors: any,
    sizes: any
) => {
    let filters: {
        brands?: string[],
        minPrice?: number,
        maxPrice?: number,
        colors?: string[],
        sizes?: string[]
    } = {}
    if (typeof brands === 'string') {
        filters.brands = brands.split(',')
    }
    if (typeof colors === 'string') {
        filters.colors = colors.split(',')
    }
    if (typeof sizes === 'string') {
        filters.sizes = sizes.split(',')
    }
    if (maxPrice) {
        filters.maxPrice = Number(maxPrice)
    }
    if (minPrice) {
        filters.minPrice = Number(minPrice)
    }
    return filters;
}

export default createFilterObject