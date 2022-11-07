import { Macrocategory } from './macrocategories';
export interface Microcategory {
    id: string,
    microcategories: Macrocategory[]
}

export const MICROCATEGORY: Microcategory[] = [
    {
        id: 'uomo_t-shirt', microcategories: [
            {
                name: 'Basic',
                DB_Category: 'basic'
            },
            {
                name: 'Top',
                DB_Category: 'top'
            },
            {
                name: 'canotte',
                DB_Category: 'Canotte'
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

