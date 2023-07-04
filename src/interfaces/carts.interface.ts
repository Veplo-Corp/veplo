

export interface ProductVariation {
    id: string,
    photo: string,
    name: string,
    brand: string,
    quantity: number,
    color: string,
    size: string,
    productId: string,
    price: {
        v1: number,
        v2: number | null,
        discountPercentage: number | null,
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
    total: number,
    productVariations: ProductVariation[]
}