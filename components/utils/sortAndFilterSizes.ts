import { Variation } from "../../src/interfaces/product.interface";

const sizes = [
    "xxs",
    "xs",
    "s",
    "m",
    "l",
    "xl",
    "xxl",
    "3xl",
    "4xl",
    "5xl",
]

export const sortAndFilterSizes = (variations: Variation[]) => {
    const totalSize = variations.map((variation: Variation) => {
        return variation.lots.map((lot: any) => {
            return lot.size
        })

    }).flat()
    return totalSize.filter((item: any,
        index: any) => totalSize.indexOf(item) === index)
        .sort(function (a: string, b: string) {
            return sizes.indexOf(a) - sizes.indexOf(b)
        });
}