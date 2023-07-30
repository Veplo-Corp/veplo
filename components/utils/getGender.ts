import { getFromLocalStorage } from "./getFromLocalStorage"

export const getGender = (): 'donna' | 'uomo' | undefined => {
    let gender = getFromLocalStorage('genderSelected')
    if (gender === 'f') {
        return 'donna'
    }
    if (gender === 'm') {
        return 'uomo'
    }
    return undefined
}