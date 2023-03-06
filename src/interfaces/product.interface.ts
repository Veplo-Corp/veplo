export interface Variation {
    id: string
    color: string
    status: string
    price: {
        v1: number,
        discountPercentage: number,
        v2?: number
    }
    photos: string[]
    lots: {
        size: string,
        quantity: string
    }[]
}

export interface Product {
    id: string,
    name: string,
    canBuy: boolean,
    status: string,
    info: {
        macroCategory: string,
        microCategory: string,
        gender: string,
        brand: string,
    }
    location: {
        type: string,
        coordinates: number[]
    },
    shopInfo: {
        id: string,
        firebaseId: string,
        name: string,
        city: string,
        status: string,
    }
    createdAt?: string
    updatedAt?: string,
    variations: Variation[]
}
