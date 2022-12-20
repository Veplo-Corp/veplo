import { CATEGORIES } from './../mook/categories';


export const findMacrocategoryName = (urlName:string, gender:string) => {
    const index = gender === 'donna' ? 0 : 1
    return Object.values(CATEGORIES)[index].abbigliamento.find(category => category.url === urlName)?.name
}