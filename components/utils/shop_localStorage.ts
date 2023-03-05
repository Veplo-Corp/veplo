export const addShopFavouriteToLocalStorage = (shop: any) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('shop_favourite', JSON.stringify(shop))
    }
}