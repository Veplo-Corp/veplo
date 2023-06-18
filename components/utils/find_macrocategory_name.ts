import { CATEGORIES } from './../mook/categories';


export const findMacrocategoryName = (name: string, gender: string): string => {
    const index = gender === 'donna' ? 0 : 1
    const macrocategory = Object.values(CATEGORIES)[index].abbigliamento.find(category => category.url === name)?.name
    return macrocategory ? macrocategory : 'abbigliamento'
}