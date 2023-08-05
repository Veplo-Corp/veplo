
export const getFavouriteShopFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        const element = localStorage.getItem('shop_favourite')

        if (element !== undefined && element !== null && element !== 'undefined') {
            const shop = JSON.parse(element);
            if (shop?.id && shop?.name && shop?.street) {
                return shop
            }
            return undefined
        } else {
            return undefined
        }
    }
    return
}