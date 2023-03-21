export interface Order {
    id: string,
    cartId: string,
    uniqueId: string,
    createdAt: string,
    totalDetails: {
        amountDiscount: number,
        amountShipping: number,
        subTotal: number,
        total: number,
    }
    shop: {
        id: string,
        name: string,
    }
    productVariations: {
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
        color: string
        size: string
    }

}