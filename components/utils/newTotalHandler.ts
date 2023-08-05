import { CartProductVariation } from '../../src/lib/apollo/generated/graphql';
import { ProductVariation } from './../../src/interfaces/carts.interface';
export const newTotalHandler = (productVariations: CartProductVariation[] | null): number => {
    if (!productVariations) { return 0 }
    let total = 0;
    productVariations.forEach(element => {
        if (!element?.quantity) return 0
        if (element?.price?.v2) {
            total += element?.price?.v2 * element?.quantity
        }
        else {
            if (!element?.price?.v1) return 0
            total += element?.price?.v1 * element?.quantity
        }
    });
    return Number(total.toFixed(2))
}