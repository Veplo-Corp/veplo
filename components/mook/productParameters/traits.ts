//TODO eliminare TRAITS
export const TRAITS = [
    'sostenibile',
    'handmade',
    'riciclato',
    //'cruelty-free',
    'pezzo unico',
    //'vegano',
    'vintage',
]

export const TRAITS_TYPES = [
    {
        name: 'clothes_traits',
        type: [
            'sostenibile',
            'handmade',
            'riciclato',
            //'cruelty-free',
            'pezzo unico',
            //'vegano',
            'vintage',
        ]
    }
]

export enum SustainableTraits {
    sostenibile = 'sostenibile',
    riciclato = 'riciclato',
}

export const arraySustainableTraits: SustainableTraits[] = [
    SustainableTraits.riciclato,
    SustainableTraits.sostenibile
];