export interface Variation {
    id: string
    color: string
    status: string
    // price: {
    //     v1: number,
    //     discountPercentage: number,
    //     v2?: number
    // }
    photos: string[]
    lots: {
        size: string,
        quantity: number
    }[]
}

export interface Product {
    id: string,
    name: string,
    canBuy: boolean,
    status: string,
    colors?: { name: string, cssColor: string }[],
    info: {
        macroCategory: string,
        microCategory: string,
        gender: string,
        brand: string,
        fit: string
    }
    price: {
        v1: number,
        discountPercentage: number,
        v2?: number
    }
    location: {
        type: string,
        coordinates: number[]
    },
    shopInfo: {
        id: string,
        businessId: string,
        name: string,
        city: string,
        status: string,
    }
    createdAt?: string,
    updatedAt?: string,
    variations: Variation[],
    //!modificare appena inserito brand in graphQL
    brand?: string
    totalSizeAvailable?: string[]
}
