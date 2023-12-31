import { Instagram } from 'iconoir-react';
import { Product } from './product.interface';

export interface AddressShop {
    postcode: string,
    city: string,
    street: string,
    location: {
        type: String
        coordinates: number[]
    }
}

export interface Shop {
    id: string,
    businessId: string,
    //TODO aggiungere tipologia negozio
    name: {
        unique: string,
        visualized: string
    },
    createdAt: string,
    categories?: string[],
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
    address: AddressShop,
    minimumAmountForFreeShipping?: number | string,
    links: {
        instagram: string,
        tiktok: string
    }
}

export interface ShopAndProducts extends Shop {
    products: {
        filters: any,
        products: Product[]
    }

}
