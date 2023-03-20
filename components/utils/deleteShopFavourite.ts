export const deleteFavouriteShopFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('shop_favourite');
    }
}