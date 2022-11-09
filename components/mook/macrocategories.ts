export interface Macrocategory {
    id?: string,
    gender?: 'uomo' | 'donna',
    name: string
    DB_Category: string
}

export const MACROCATEGORY: Macrocategory[] = [
    {id: 'uomo_t-shirt', gender: 'uomo' , name: 'T-shirt', DB_Category: 'T-shirt & Polo'},
    {id: 'uomo_pantalone', gender: 'uomo' , name: 'Pantalone', DB_Category: 'pantalone'},
    {id: 'uomo_scarpe', gender: 'uomo' , name: 'Scarpe', DB_Category: 'scarpe'},
    {id: 'donna_gonna', gender: 'donna' , name: 'Gonna', DB_Category: 'gonna'},
    {id: 'donna_blues', gender: 'donna' , name: 'Blues', DB_Category: 'blues'},
    {id: 'donna_giacche_e_blazer', gender: 'donna' , name: 'Giacche e blazer', DB_Category: 'giacche_e_blazer'},
    {id: 'donna_pantalone', gender: 'uomo' , name: 'Pantalone', DB_Category: 'pantalone'},

]