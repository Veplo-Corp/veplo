import { Product } from './product.interface';
export interface Shop {
    id: string,
    businessId: string,
    name: string,
    createdAt: string,
    status: 'not_active' | 'active',
    isDigitalOnly: boolean,
    info: {
        phone: string
        description: string
        opening: {
            days: number[],
            hours: string[]
        }
    }
    profileCover: string,
    profilePhoto: string,
    address: {
        postcode: string,
        city: string,
        street: string,
        location: {
            type: String
            coordinates: number[]
        }
    },
}

export interface ShopAndProducts extends Shop {


    products: Product[]
}
