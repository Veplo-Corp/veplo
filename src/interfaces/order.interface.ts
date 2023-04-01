export interface ProductVariationInOrder {
    productId: string,
    variationId: string,
    photo: string,
    name: string,
    price: {
        v1: number,
        v2: number,
        discountPercentage: number,
    }
    quantity: number,
    color: string,
    size: string,
    brand: string
}

export interface Address {
    city: string,
    country: string,
    line1: string,
    line2: string,
    postalCode: string,
    state: string,
}

export interface Order {
    id: string,
    cartId: string,
    status: string,
    createdAt: string,
    code: string,
    totalDetails: {
        amountDiscount: number,
        amountShipping: number,
        subTotal: number,
        total: number,
    }
    shipping: {
        url: string,
        courier: string,
        code: string,
    }
    shop: {
        id: string,
        name: string,
    },
    recipient: {
        id: string,
        name: string,
        address: Address
    }
    productVariations: ProductVariationInOrder[],

}