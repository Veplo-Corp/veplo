export interface Product {
    id: string,
    name: string,
    price: {
        v1: number,
        v2: number,
        discountPercentage: number
    },
    colors: any[],
    sizes: string[],
    macroCategory: string,
    microCategory: string,
    gender: string,
    brand: string,
    shopId: string,
    firebaseShopId: string,
    photos: string[],
    updatedAt: string,
    location: {
        type: string,
        coordinates: number[]
    },
    shopOptions: {
        city: string,
        name: string,
    }
    description?: string,
    status:string
}
