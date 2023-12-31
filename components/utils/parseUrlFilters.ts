export const parseSlugUrlFilter = (slug: string | undefined) => {

    if (!slug) return undefined
    const params = new URLSearchParams(slug);
    const sizes = params.get('sizes');
    const colors = params.get('colors');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    const brand = params.get('brand');
    const sale = params.get('sale');
    const sostenibile = params.get('sostenibile');
    const query = params.get('query');

    const parsedParams: any = {};
    if (sizes) {
        parsedParams['sizes'] = sizes.split(',');
    }
    if (query) {
        parsedParams['query'] = query;
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
    if (brand) {
        parsedParams['brand'] = brand;
    }
    if (sale && sale === 'true') {
        parsedParams['sale'] = "true";
    }
    if (sostenibile && sostenibile === 'true') {
        parsedParams['traits'] = ["sostenibile", "riciclato"];
    }
    //TODO inserire anche traits, materials, length, fit
    return Object.keys(parsedParams).length ? parsedParams : undefined;
}