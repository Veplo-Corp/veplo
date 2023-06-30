import { getFromLocalStorage } from "./getFromLocalStorage"

export const getCategoryType = () => {
    if (typeof window !== "undefined") {
        const typeProduct = getFromLocalStorage('setTypeProduct')
        if (typeProduct === 'abbigliamento' || typeProduct === 'accessori') {
            return typeProduct
        } else {
            return 'abbigliamento'
        }
    }
    return 'abbigliamento'

}