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
    sizeGuidePhoto: string | null;
    colors?: { name: string, cssColor: string }[],
    info: {
        macroCategory: string,
        microCategory: string,
        gender: 'm' | 'f' | 'u',
        brand: string,
        fit?: string,
        traits: ('eco-friendly' | 'vegan' | 'handmade' | 'vintage')[],
        materials: string[],
        length?: string
        description?: string,
        modelDescription?: string,
        univers?: 'abbigliamento' | 'accessori'
    }
    price: {
        v1: number,
        discountPercentage: number,
        v2: number
    }
    location: {
        type: string,
        coordinates: number[]
    },
    shopInfo: {
        id: string,
        businessId: string,
        name: {
            unique: string,
            visualized: string
        }
        city: string,
        status: string,
        profilePhoto: string,
        minimumAmountForFreeShipping?: number
    }
    createdAt?: string,
    updatedAt?: string,
    variations: Variation[],
    totalSizeAvailable?: string[],
}
