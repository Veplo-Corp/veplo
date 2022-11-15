export const createTextCategory = (macroCategory: string, microCategory: string) => {
    return macroCategory.toLocaleLowerCase().includes(microCategory.toLocaleLowerCase()) 
        ? microCategory
        : macroCategory + ' ' + microCategory
}