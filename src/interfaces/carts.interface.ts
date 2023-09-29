import { CartProductVariation } from "../lib/apollo/generated/graphql"


export interface ProductVariationInCart {
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

export interface CartDispatch {
    id: string,
    userId: string,
    shopInfo: {
        id: string,
        name: {
            unique: string,
            visualized: string
        },
        city: string,
        status: string,
        minimumAmountForFreeShipping?: number | null,
        profilePhoto?: string
    },
    total: number,
    productVariations: CartProductVariation[]
}