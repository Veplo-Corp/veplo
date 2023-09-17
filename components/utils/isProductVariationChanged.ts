import { VariationCard } from "../../src/interfaces/variationCard.interface";

export const isProductVariationChanged = (variation: VariationCard, newVariation: VariationCard) => {
    if (variation.lots.length !== newVariation.lots.length) return true
    if (variation.photos.length !== newVariation.photos.length) return true
    for (let i = 0; i < variation.lots.length; i++) {
        if (variation.lots[i].quantity !== newVariation.lots[i].quantity) return true
        if (variation.lots[i].size !== newVariation.lots[i].size) return true
    }
    for (let i = 0; i < variation.photos.length; i++) {
        if (variation.photos[i] !== newVariation.photos[i]) return true
    }
    return false

}