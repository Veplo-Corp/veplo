import { CATEGORIES, Category, Univers } from './../mook/categories';


export const findMicrocategoryName = (macrocategory: string, gender: string, microcategory: string, productsType: Univers): string | null => {
    const index = gender === 'donna' ? 0 : 1
    //TODO Gestire GategoryType!
    const arrayOfMicrocategory = Object.values(CATEGORIES)[index][productsType].find((category: Category) => category.name === macrocategory)?.types


    const element = arrayOfMicrocategory?.filter((element: any) =>
        element.toLowerCase()
            .replace(/[-\s]/g, '') === microcategory.toLowerCase()
                .replace(/[-\s]/g, '')
    )[0]

    return element ? element : null


}