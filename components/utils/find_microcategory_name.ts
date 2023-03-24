import { CATEGORIES } from './../mook/categories';


export const findMicrocategoryName = (name: string, gender: string, microCat: string) => {
    const index = gender === 'donna' ? 0 : 1
    const arrayOfMicrocategory = Object.values(CATEGORIES)[index].abbigliamento.find(category => category.url === name)?.types

    const element = arrayOfMicrocategory?.filter(element =>
        element.toLowerCase()
            .replace(/[-\s]/g, '') === microCat.toLowerCase()
                .replace(/[-\s]/g, '')
    )[0]
    return element


}