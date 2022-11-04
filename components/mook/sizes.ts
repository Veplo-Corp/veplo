import { Macrocategory } from './macrocategories';
export interface Sizes {
    id: string,
    microcategories: Macrocategory[]
}

export const SIZES: Sizes[] = [
    {
        id: 'vestiti', microcategories: [
            {
                name: 'xs',
                DB_Category: 'xs'
            },
            {
                name: 's',
                DB_Category: 's'
            },
            {
                name: 'm',
                DB_Category: 'm'
            },
        ]
    }, {
        id: 'scarpe', microcategories: [
            {
                name: '38',
                DB_Category: '38'
            },
            {
                name: '40',
                DB_Category: '40'
            },
            {
                name: '42',
                DB_Category: '42'
            },
        ]
    }

]

