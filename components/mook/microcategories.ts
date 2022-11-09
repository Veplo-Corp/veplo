import { Macrocategory } from './macrocategories';
export interface Microcategory {
    id: string,
    microcategories: Macrocategory[]
}

export const MICROCATEGORY: Microcategory[] = [
    {
        id: 'uomo_t-shirt', microcategories: [
            {
                name: 'a maniche lunghe',
                DB_Category: 'a maniche lunghe'
            },
            {
                name: 'basic',
                DB_Category: 'basic'
            },
            {
                name: 'canotte',
                DB_Category: 'canotte'
            },
        ]
    }, {
        id: 'uomo_pantalone', microcategories: [
            {
                name: 'jeans',
                DB_Category: 'jeans'
            },
            {
                name: 'leggins',
                DB_Category: 'Leggins'
            },
            {
                name: 'Pantaloni da jogging',
                DB_Category: 'pantaloni_da_jogging'
            },
        ]
    }

]

