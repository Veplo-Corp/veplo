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
                name: "T-Shirt",
                url: "t-shirt",
                types: [
                    "maniche corte",
                    "canotte",
                    "polo",
                    "sportive",
                    "maniche lunghe",
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
                name: "Maglieria",
                url: "maglieria",
                types: [
                    "maglioni",
                    "pullover",
                    "cardigan",
                    "liscio",
                    "trecce",
                    "coste",
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
                    "senza cappuccio",
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
                name: "Top",
                url: "top",
                types: [
                    "maniche corte",
                    "maniche lunghe",
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
                name: "Pantaloni",
                url: "pantaloni",
                types: [
                    "casual",
                    "palazzo",
                    "zampa d'elefante",
                    "salopette",
                    "shorts",
                    "cargo",
                    "sportivi",
                    "tuta",
                    "leggins",
                    "chino",
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
                    "casual",
                    "palazzo",
                    "zampa d'elefante",
                    "affusolati",
                    "strappati",
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
                //!aggiunte scarpe donna
                name: "Scarpe",
                url: "scarpe",
                types: [
                    "sneakers",
                    "sportive",
                    "eleganti",
                    "trekking",
                    "polacchine",
                    "stivali",
                    "mocassini",
                    "zoccoli",
                    "aperte",
                    "sandali",
                    "piatte",
                    "ciabatte",
                    "tacco",
                    "ballerine",
                    "stivaletti",
                    "basse",
                    "décolletè",
                    "stringate",
                    "slip-on",
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
                name: "Gonne",
                url: "gonne",
                types: [
                    "lunghe",
                    "corte",
                    "jeans",
                    "tubino",
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
                name: "Abiti",
                url: "abiti",
                types: [
                    "sera",
                    "mare",
                    "jeans",
                    "classico",
                    "lunghi",
                    "cocktail",
                    "caftani",
                    "camicia",
                    "maglina",
                    "tubini",
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
                    "eleganti",
                    "jeans",
                    "camiciette",
                    "maniche corte",
                    "lino",
                    "hawaiana",
                    "senza maniche",
                    "pizzo",
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
                name: "Giacche",
                url: "giacche",
                types: [
                    "leggere",
                    "pelle",
                    "invernali",
                    "piumini",
                    "bomber",
                    "jeans",
                    "sportive",
                    "gilet",
                    "impermeabili",
                    "smanicate",
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
                    "classici",
                    "trench",
                    "invernali",
                    "piumini",
                    "parka",
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
                    "classici",
                    "corti",
                    "lunghi",
                ],
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
                    "slip",
                    "bikini",
                    "interi",
                    "bermuda",
                    "boxer",
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
                name: "Bermuda",
                url: "bermuda",
                types: [
                    "classici",
                    "cargo",
                    "jeans",
                    "tuta",
                ],
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

        ],
        accessori: [

            {
                name: "Borse",
                url: "borse",
                types: [
                    "tracolla",
                    "shopping",
                    "business",
                    "laptop",
                    "sportive",
                    "borsette",
                    "viaggio",
                    "a mano",
                    "clutch",
                    "spalla",
                    "marsupi",
                    "astucci",
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
                name: "Zaini",
                url: "zaini",
                types: [
                    "classici",
                    "tracolla",
                    "trekking",
                    "sportivi",
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
                    "anelli",
                    "orecchini",
                    "ciondoli",
                    "capelli",
                    "cavigliere",
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
                    "visiera",
                    "berretti",
                    "pesca",
                    "panama",
                    "paraorecchie",
                    "foulards",
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
                    "casual",
                    "eleganti",
                    "intrecciate",
                    "vita alta",
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
                    "classiche",
                    "leggere",
                    "scaldacollo",
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
                    "classici",
                    "muffola",
                    "senza dita",
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
                    "maniche corte",
                    "polo",
                    "canotte",
                    "maniche lunghe",
                    "sportive",
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
                name: "Camicie",
                url: "camicie",
                types: [
                    "casual",
                    "eleganti",
                    "jeans",
                    "maniche corte",
                    "lino",
                    "hawaiana",
                    "senza maniche",
                    "pizzo",
                    "camiciette",
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
                    "senza cappuccio",
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
                    "maglioni",
                    "pullover",
                    "cardigan",
                    "liscio",
                    "trecce",
                    "coste",
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
                name: "Pantaloni",
                url: "pantaloni",
                types: [
                    "casual",
                    "cargo",
                    "chino",
                    "sportivi",
                    "tuta",
                    "palazzo",
                    "zampa d'elefante",
                    "salopette",
                    "shorts",
                    "leggins",
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
                name: "Jeans",
                url: "jeans",
                types: [
                    "casual",
                    "strappati",
                    "palazzo",
                    "zampa d'elefante",
                    "affusolati",
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
                name: "Giacche",
                url: "giacche",
                types: [
                    "leggere",
                    "pelle",
                    "invernali",
                    "piumini",
                    "bomber",
                    "jeans",
                    "sportive",
                    "gilet",
                    "impermeabili",
                    "smanicate",
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
                    "classici",
                    "invernali",
                    "piumini",
                    "parka",
                    "trench",
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
                name: "Bermuda",
                url: "bermuda",
                types: [
                    "classici",
                    "cargo",
                    "jeans",
                    "tuta",
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
                name: "Costumi",
                url: "costumi",
                types: [
                    "bermuda",
                    "boxer",
                    "slip",
                    "bikini",
                    "interi",
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
                name: "Blazer",
                url: "blazer",
                types: [
                    "classici",
                    "corti",
                    "lunghi",
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
                name: "Abiti",
                url: "abiti",
                types: [
                    "sera",
                    "mare",
                    "jeans",
                    "classico",
                    "lunghi",
                    "cocktail",
                    "caftani",
                    "camicia",
                    "maglina",
                    "tubini",
                ],
                sizes: "man_clothes_sizes",
                traits: 'clothes_traits',
                materials: 'clothes_materials',
                fit: 'clothes_fit',
                length: 'clothes_length',
                colors: 'clothes_colors',
                sizeGuideCode: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES'
            },
        ],
        accessori: [
            {
                name: "Cappelli",
                url: "cappelli",
                types: [
                    "visiera",
                    "berretti",
                    "pesca",
                    "panama",
                    "paraorecchie",
                    "foulards",
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
                    "casual",
                    "eleganti",
                    "intrecciate",
                    "vita alta",
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
                name: "Zaini",
                url: "zaini",
                types: [
                    "classici",
                    "tracolla",
                    "trekking",
                    "sportivi",
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
                name: "Borse",
                url: "borse",
                types: [
                    "tracolla",
                    "shopping",
                    "business",
                    "laptop",
                    "sportive",
                    "borsette",
                    "viaggio",
                    "a mano",
                    "clutch",
                    "spalla",
                    "marsupi",
                    "astucci",
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
                name: "Sciarpe",
                url: "sciarpe",
                types: [
                    "classiche",
                    "leggere",
                    "scaldacollo",
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
                    "classici",
                    "muffola",
                    "senza dita",
                ],
                sizes: "gloves_man_sizes",
                traits: "clothes_traits",
                materials: "clothes_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'GLOVES_MAN_SIZES'
            },
            {
                name: "Gioielli",
                url: "gioielli",
                types: [
                    "collane",
                    "bracciali",
                    "anelli",
                    "orecchini",
                    "ciondoli",
                    "capelli",
                    "cavigliere",
                ],
                sizes: "jewellery_man_sizes",
                traits: "clothes_traits",
                materials: "jewellery_materials",
                fit: undefined,
                length: undefined,
                colors: "clothes_colors",
                sizeGuideCode: 'JEWELLERY_MAN_SIZES'
            },

            //TODO portafoglio
        ],
    },
};