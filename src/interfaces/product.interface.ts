export interface Product {
    id: string,
    name: string,
    price: number,
    colors: any[],
    sizes: string[],
    macroCategory: string,
    microCategory: string,
    gender: string,
    brand: string,
    shopId: string,
    firebaseShopId: string,
    photos?: string[],
    updatedAt: string,
    location: {
        type: string,
        coordinates: number[]
    },
    shop: {
        city: string,
        name: string,
    }
    description?: string,
}
