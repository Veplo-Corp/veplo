import { getFromLocalStorage } from "./getFromLocalStorage"

export const getUnivers = () => {
    if (typeof window !== "undefined") {
        const univers = getFromLocalStorage('univers')
        if (univers === 'abbigliamento' || univers === 'accessori') {
            return univers
        } else {
            return 'abbigliamento'
        }
    }
    return 'abbigliamento'

}