export const parseSlugUrlFilter = (slug: string | undefined) => {

    if (!slug) return undefined
    const params = new URLSearchParams(slug);
    const sizes = params.get('sizes');
    const colors = params.get('colors');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');

    const parsedParams: any = {};
    if (sizes) {
        parsedParams['sizes'] = sizes.split(',');
    }
    if (colors) {
        parsedParams['colors'] = colors.split(',');
    }
    if (minPrice) {
        parsedParams['minPrice'] = parseInt(minPrice, 10);
    }
    if (maxPrice) {
        parsedParams['maxPrice'] = parseInt(maxPrice, 10);
    }
    //TODO inserire anche traits, materials, length, fit
    return Object.keys(parsedParams).length ? parsedParams : undefined;
}