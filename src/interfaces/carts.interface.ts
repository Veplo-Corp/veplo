

export interface ProductVariation {
    id: string,
    variationId: string,
    photo: string,
    name: string,
    brand: string,
    quantity: number,
    color: string,
    size: string,
    price: {
        v1: number,
        v2: number,
        discountPercentage: number,
    },
}

export interface Cart {
    id: string,
    userId: string,
    shopInfo: {
        id: string,
        name: string,
        city: string,
        status: string,
    },
    price: {
        v1: number,
        v2: number,
        discountPercentage: number,
    },
    productVariations: ProductVariation[]
}