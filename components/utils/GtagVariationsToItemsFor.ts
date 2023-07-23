import { CartProductVariation } from "../../src/lib/apollo/generated/graphql";
import { formatNumberWithTwoDecimalsInNumber } from "./formatNumberWithTwoDecimalsInNumber";

export const GtagVariationsToItemsFor = (variations: CartProductVariation[] | undefined | null): any[] => {
    if (!variations) return [];
    const items = variations?.map(variation => {


        const price = variation?.price?.v1 && variation?.price?.v2 && variation?.price?.v2 < variation?.price?.v1 ?
            formatNumberWithTwoDecimalsInNumber(variation?.price?.v2)
            :
            variation?.price?.v1 && variation?.price?.v2 && variation?.price?.v2 >= variation?.price?.v1 ?
                formatNumberWithTwoDecimalsInNumber(variation?.price?.v1)
                :
                0

        const discount = formatNumberWithTwoDecimalsInNumber(variation?.price?.v1 && variation?.price?.v2 ? variation?.price?.v1 - variation?.price?.v2 : 0)

        console.log(discount);

        console.log(price);

        return {
            item_id: variation?.id,
            item_name: variation?.name,
            discount: discount,
            item_brand: variation?.brand,
            //TODO aggiungere a variation gender, univers, macrocategory, microcategory
            item_variant: variation?.color,
            price: price,
            quantity: variation?.quantity
        }
    })

    return items
}