import { ProductVariation } from './../../src/interfaces/carts.interface';
export const newTotalHandler = (productVariations: ProductVariation[]) => {

    let total = 0;
    productVariations.forEach(element => {
        console.log(element);

        if (element.price.v2) {
            total += element.price.v2 * element.quantity
        }
        else {
            console.log('passa qui');

            total += element.price.v1 * element.quantity
        }
    });
    return Number(total.toFixed(2))
}