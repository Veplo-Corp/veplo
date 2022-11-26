import { Product } from "../../src/interfaces/product.interface"
import createUrlScheme from "../utils/create_url"

export const toProductPage = (product: Product) => {
    const category =
        product.macroCategory.toLocaleLowerCase().includes(product.microCategory.toLocaleLowerCase())
            ? product.microCategory
            : product.macroCategory + '-' + product.microCategory
    return createUrlScheme([product.brand, product.name, category])
}

