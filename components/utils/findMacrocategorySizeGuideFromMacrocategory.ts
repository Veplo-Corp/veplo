import { CATEGORIES } from "../mook/categories";
import { GUIDE_SIZES } from "../mook/sizeGuide";

export const findMacrocategorySizeGuideFromMacrocategory = (macrocategory: string, gender: 'uomo' | 'donna') => {

    //TODO Gestire GategoryType!
    const macroCategoryInfo = CATEGORIES[gender]['abbigliamento'].find(element => element.name.toLowerCase() === macrocategory.toLowerCase())
    console.log(macroCategoryInfo?.sizeGuideCode);
    console.log(CATEGORIES[gender]['abbigliamento']);

    if (!macroCategoryInfo?.sizeGuideCode) return undefined
    const guideSized = GUIDE_SIZES.find(element => element.name === macroCategoryInfo?.sizeGuideCode)?.sizes
    if (!guideSized) return undefined
    return guideSized
}