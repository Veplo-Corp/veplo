import { Product } from "../../src/interfaces/product.interface"
import createUrlScheme from "../utils/create_url"

export const toProductPage = (product: Product) => {
    // const category =
    //     product.info.macroCategory.toLocaleLowerCase().includes(product.info.microCategory.toLocaleLowerCase())
    //         ? product.info.microCategory
    //         : product.info.macroCategory + '-' + product.info.microCategory
    // return createUrlScheme([product.info.brand, product.name, category])
    return createUrlScheme([product.info.brand, product.name])
}

