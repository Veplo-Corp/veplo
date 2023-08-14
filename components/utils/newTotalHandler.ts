import { Maybe } from "graphql/jsutils/Maybe";
import { CartProductVariation } from "../../src/lib/apollo/generated/graphql";

export const newTotalHandler = (productVariations: Maybe<CartProductVariation>[]): number => {
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