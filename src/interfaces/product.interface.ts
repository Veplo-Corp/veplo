export interface Product {
    id: string,
    name: string
    photos: string[]
    price: number,
    colors: string[]
    sizes:string[],
    macroCategory:string,
    microCategory :string,
    gender: string
    brand: string
    location:{
        type: string,
        coordinates: number[]
    },
    shopId: string,
    description: string,
    cityShop:string
    updateTime: string,
    shopName: string
    firebaseShopId: string,
}
