import { CATEGORIES, Category } from './../mook/categories';


export const findMicrocategoryName = (macrocategory: string, gender: string, microcategory: string): string | null => {
    const index = gender === 'donna' ? 0 : 1
    const arrayOfMicrocategory = Object.values(CATEGORIES)[index].abbigliamento.find((category: Category) => category.name === macrocategory)?.types

    console.log(arrayOfMicrocategory);

    const element = arrayOfMicrocategory?.filter((element: any) =>
        element.toLowerCase()
            .replace(/[-\s]/g, '') === microcategory.toLowerCase()
                .replace(/[-\s]/g, '')
    )[0]

    return element ? element : null


}