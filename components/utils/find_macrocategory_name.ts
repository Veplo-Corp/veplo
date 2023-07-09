import { CATEGORIES, Category, Univers } from './../mook/categories';


export const findMacrocategoryName = (name: string, gender: string, productsType: Univers): string | null => {
    console.log('Name', name);
    const index = gender === 'donna' ? 0 : 1
    //TODO Gestire GategoryType!

    const macrocategory = Object.values(CATEGORIES)[index][productsType].find((category: Category) => category.url === name)?.name
    return macrocategory ? macrocategory : null
}