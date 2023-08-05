import { CATEGORIES, Univers } from "../mook/categories";
import { GUIDE_SIZES } from "../mook/sizeGuide";

export const findMacrocategorySizeGuideFromMacrocategory = (macrocategory: string, gender: 'uomo' | 'donna', univers: Univers) => {

    //TODO Gestire GategoryType!
    const macroCategoryInfo = CATEGORIES[gender][univers].find(element => element.name.toLowerCase() === macrocategory.toLowerCase())


    if (!macroCategoryInfo?.sizeGuideCode) return undefined
    const guideSized = GUIDE_SIZES.find(element => element.name === macroCategoryInfo?.sizeGuideCode)?.sizes
    if (!guideSized) return undefined
    return guideSized
}