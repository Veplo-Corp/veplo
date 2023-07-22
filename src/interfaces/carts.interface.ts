import { CartProductVariation } from "../lib/apollo/generated/graphql"


export interface ProductVariation {
    id: string,
    photo: string,
    name: string,
    brand: string,
    quantity: number,
    maxQuantity: number,
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
        minimumAmountForFreeShipping?: number,
        profilePhoto?: string
    },
    total: number,
    productVariations: CartProductVariation[]
}