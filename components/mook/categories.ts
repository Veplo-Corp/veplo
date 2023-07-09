export type Univers = 'abbigliamento' | 'accessori'

export interface Category {
    name: string,
    url: string,
    types: string[],
    sizes: string | undefined,
    traits: string | undefined,
    materials: string | undefined,
    fit: string | undefined,
    length: string | undefined,
    colors: string | undefined,
    sizeGuideCode: string | undefined
}

export interface Categories {
    donna:
    {
        abbigliamento: Category[],
        accessori: Category[]
    },
    uomo:
    {
        abbigliamento: Category[],
        accessori: Category[]
    }
}



export const CATEGORIES: Categories = {
    donna: {
        abbigliamento: [
            // { name: "Tutto l'abbigliamento" },
            {
                name: "Vestiti",
                url: "vestiti",
                types: [
                    "caftani",
                    "camicia",
                    "maglina",
                    "tubini",
                    "lunghi",
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_WOMAN_CLOTHES_SIZES'
            },
            {
                name: "T-Shirt",
                url: "t-shirt",
                types: [
                    "maniche lunghe",
                    "maniche corte",
                    "mezze maniche",
                    "senza maniche",
                    "jeans",
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Top",
                url: "top",
                types: [
                    "maniche lunghe",
                    "maniche corte",
                    "mezze maniche",
                    "senza maniche",
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Camicie", //Camicie & Bluse
                url: "camicie",
                types: [
                    "casual",
                    "hawaiana",
                    "jeans",
                    "lino",
                    "eleganti"
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Bluse", //Camicie & Bluse
                url: "bluse",
                types: [
                    "basic",
                    "senza maniche",
                    "trapezio"
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_WOMAN_CLOTHES_SIZES'
            },
            {
                name: "Pantaloni",
                url: "pantaloni",
                types: [
                    "basic",
                    "leggins",
                    "cargo",
                    "salopette",
                    "tuta",
                    "palazzo",
                    "zampa d'elefante",
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Jeans",
                url: "jeans",
                types: [
                    "basic",
                    "palazzo",
                    "zampa d'elefante"
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'
            },
            {
                name: "Felpe",
                url: "felpe",
                types: [
                    "cappuccio",
                    "zip",
                    "senza cappuccio"
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Giacche",
                url: "giacche",
                types: [
                    "leggere",
                    "impermeabili",
                    "smanicate",
                    "vento",
                    "sportive",
                    "invernali",
                    "piumini",
                    "bomber",
                    "jeans",
                    "gilet",
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Blazer",
                url: "blazer",
                types: [
                    "leggeri",
                    "impermeabili",
                    "smanicati",
                    "vento",
                    "sportivi",
                    "invernali",
                    "jeans",
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Cappotti",
                url: "cappotti",
                types: [
                    "basic",
                    "parka",
                    "trench",
                    "invernali",
                    "piumini"
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Maglieria",
                url: "maglieria",
                types: ["cardigan", "maglioni"],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },

            //!aggiunto costumi: ["costumi"],
            {
                name: "Costumi",
                url: "costumi",
                types: [
                    "costumi interi",
                    "bikini"
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'
            },
            {
                name: "Gonne",
                url: "gonne",
                types: [
                    "pieghe",
                    "trapezio",
                    "tubino",
                    "portafoglio",
                    "jeans",
                ],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Shorts",
                url: "shorts",
                types: ["basic", "sportivi"],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },
            {
                name: "Bermuda",
                url: "bermuda",
                types: ["cargo", "jeans", "tuta", "basic"],
                sizes: "woman_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES'

            },

            // {
            //     name: "Abbigliamento sportivo",
            //     url: "abbigliamento-sportivo",
            //     types:
            //         [
            //             "t-shirt & polo",
            //             "pantaloni",
            //             "reggiseni",
            //             "giacche & coprispalla",
            //             "felpe",
            //             "tute sportive",
            //             "moda mare",
            //             "vestiti & gonne",
            //             "calzini",
            //             "intimo e strati base",
            //             "merchandising ufficiale"
            //         ],
            //     sizes: "woman_clothes_sizes",

            // },
            {
                //!aggiunte scarpe donna
                name: "Scarpe",
                url: "scarpe",
                types: [
                    "sneakers",
                    "sandali",
                    "piatte",
                    "ciabatte",
                    "tacco",
                    "ballerine",
                    "stivaletti",
                    "stivali",
                    "sportive",
                    "sposa",
                    "pantofole",
                    "trekking",
                    "mocassini",
                    "polacchine",
                    "basse",
                    "décolletè",
                    "zoccoli",
                    "aperte",
                    "mocassini",
                    "stringate",
                    "slip-on",
                    "eleganti"
                ],
                sizes: "shoes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: undefined,
                length: undefined,
                colors: 'clothes_colors',
                sizeGuideCode: undefined

            },
        ],
        accessori: [
            {
                name: "Borse",
                url: "borse",
                types: [
                    "a mano",
                    "clutch",
                    "shopping bags",
                    "borse a spalla",
                    "porta pc",
                    "per lo sport",
                    "marsupi",
                    "astucci",
                    "zaini",
                    "bagagli e accessori",
                ],
                sizes: "bag_sizes",
                traits: "clothes_traits",
                materials: "bag_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: undefined
            },
            {
                name: "Gioielli",
                url: "gioielli",
                types: [
                    "collane",
                    "bracciali",
                    "orecchini",
                    "anelli",
                    "ciondoli",
                    "gioielli per capelli",
                    "cavigliere"
                ],
                sizes: "jewellery_woman_sizes",
                traits: "clothes_traits",
                materials: "jewellery_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'JEWELLERY_WOMAN_SIZES'
            },
            {
                name: "Cappelli",
                url: "cappelli",
                types: [
                    "berretti",
                    "cappelli con visiera",
                    "cappelli panama",
                    "paraorecchie",
                    "foulards"
                ],
                sizes: "cap_woman_sizes",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'CAP_WOMAN_SIZES'
            },
            {
                name: "Cinture",
                url: "cinture",
                types: [
                    "cinture casual",
                    "cinture a vita alta",
                    "cinture intrecciate"
                ],
                sizes: "belt_woman_sizes",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'BELT_WOMAN_SIZES'
            },
            {
                name: "Sciarpe",
                url: "sciarpe",
                types: [
                    "sciarpe",
                    "sciarpe leggere",
                    "scaldacollo"
                ],
                sizes: "one_size",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: undefined
            },
            {
                name: "Guanti",
                url: "guanti",
                types: [
                    "con dita",
                    "muffola",
                    "senza dita"
                ],
                sizes: "gloves_woman_sizes",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'GLOVES_WOMAN_SIZES'
            },
            //TODO portafoglio
        ],
    },
    uomo: {
        abbigliamento: [
            {
                name: "T-Shirt",
                url: "t-shirt",
                types: [
                    "maniche lunghe",
                    "maniche corte",
                    "mezze maniche",
                    "senza maniche",
                    "jeans",
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES'


            },
            {
                name: "Top",
                url: "top",
                types: [
                    "maniche lunghe",
                    "maniche corte",
                    "mezze maniche",
                    "senza maniche",
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES'

            },
            {
                name: "Camicie",
                url: "camicie",
                types: [
                    "hawaiana",
                    "jeans",
                    "lino",
                    "casual",
                    "eleganti"
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES'

            },
            {
                name: "Felpe",
                url: "felpe",
                types: [
                    "cappuccio",
                    "zip",
                    "senza cappuccio"
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES'

            },
            {
                name: "Maglieria",
                url: "maglieria",
                types: [
                    "cardigan",
                    "pullover"
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES'
            },
            {
                name: "Jeans",
                url: "jeans",
                types: [
                    "basic", "palazzo", "zampa d'elefante"
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_MAN_CLOTHES_SIZES'

            },
            {
                name: "Pantaloni",
                url: "pantaloni",
                types: [
                    "chino",
                    "basic",
                    "leggins",
                    "cargo",
                    "salopette",
                    "tuta",
                    "palazzo",
                    "zampa d'elefante",
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_MAN_CLOTHES_SIZES'
            },
            {
                name: "Bermuda",
                url: "bermuda",
                types: [
                    "cargo", "jeans", "tuta", "basic"
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_MAN_CLOTHES_SIZES'

            },
            // {
            //     name: "Abbigliamento sportivo",
            //     url: "abbigliamento-sportivo",
            //     types: [
            //         "Magliette",
            //         "Pantaloni sportivi",
            //         "Giacche & Gilet",
            //         "Completi da allenamento",
            //         "Felpe",
            //         "Merchandising ufficiale",
            //         "Calze & calzini",
            //         "Moda mare & surf",
            //         "Intimo e strati base"
            //     ],
            //     sizes: "man_clothes_sizes",
            // },
            {
                name: "Giacche",
                url: "giacche",
                types: [
                    "leggere",
                    "impermeabili",
                    "smanicate",
                    "vento",
                    "sportive",
                    "invernali",
                    "piumini",
                    "bomber",
                    "jeans",
                    "gilet",
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES'

            },
            {
                name: "Cappotti",
                url: "cappotti",
                types: [
                    "piumini",
                    "basic",
                    "parka",
                    "trench",
                    "invernali"
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES'

            },
            {
                name: "Scarpe",
                url: "scarpe",
                types: [
                    "sneakers",
                    "sandali",
                    "piatte",
                    "ciabatte",
                    "ballerine",
                    "stivaletti",
                    "stivali",
                    "sportive",
                    "pantofole",
                    "trekking",
                    "mocassini",
                    "polacchine",
                    "basse",
                    "zoccoli",
                    "aperte",
                    "mocassini",
                    "stringate",
                    "slip-on",
                    "eleganti"
                ],
                sizes: "shoes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: undefined,
                length: undefined,
                colors: 'clothes_colors',
                sizeGuideCode: undefined

            },
            {
                name: "Costumi",
                url: "costumi",
                types: [
                    "bermuda",
                    "boxer",
                    "slip"
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_MAN_CLOTHES_SIZES'

            },

        ],
        accessori: [
            {
                name: "Borse",
                url: "borse",
                types: [
                    "borse a tracolla",
                    "shopping bag",
                    "borse business & laptop",
                    "borse sportive",
                    "zaini",
                    "borsette",
                    "borse da viaggio & valigie",
                    "borsa fasciatoio"
                ],
                sizes: "bag_sizes",
                traits: "clothes_traits",
                materials: "bag_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: undefined

            },
            {
                name: "Gioielli",
                url: "gioielli",
                types: [
                    "collane",
                    "bracciali",
                    "orecchini",
                    "anelli",
                    "ciondoli",
                ],
                sizes: "jewellery_man_sizes",
                traits: "clothes_traits",
                materials: "jewellery_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'JEWELLERY_MAN_SIZES'
            },
            {
                name: "Cappelli",
                url: "cappelli",
                types: [
                    "cappelli",
                    "berretti",
                    "berretti con visiera",
                ],
                sizes: "cap_man_sizes",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'CAP_MAN_SIZES'
            },
            {
                name: "Cinture",
                url: "cinture",
                types: [
                    "cinture casual",
                    "cinture classiche",
                    "cinture intrecciate"
                ],
                sizes: "belt_man_sizes",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'BELT_MAN_SIZES'
            },
            {
                name: "Sciarpe",
                url: "sciarpe",
                types: [
                    "sciarpe",
                    "sciarpe leggere",
                    "scaldacollo"
                ],
                sizes: "one_size",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: undefined
            },
            {
                name: "Guanti",
                url: "guanti",
                types: [
                    "con dita",
                    "muffola",
                    "senza dita"
                ],
                sizes: "gloves_man_sizes",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'GLOVES_MAN_SIZES'
            },
            //TODO portafoglio
        ],
    },
};