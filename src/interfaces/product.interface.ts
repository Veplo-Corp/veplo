export interface Product {
    name: string,
    colors: string[],
    location:{
        type: string,
        coordinates: number[]
    },
    macroCategory: string,
    microCategory: string,
    price: number,
    sizes: string[]

}