import { CATEGORIES } from './../mook/categories';


export const findMacrocategoryName = (name:string, gender:string) => {
    const index = gender === 'donna' ? 0 : 1
    console.log(Object.values(CATEGORIES)[index].abbigliamento.find(category => category.url === name)?.name);
    return Object.values(CATEGORIES)[index].abbigliamento.find(category => category.url === name)?.name
}