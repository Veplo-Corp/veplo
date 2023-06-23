export interface Category {
    name: string,
    url: string,
    types: string[],
    sizes: string | undefined,
    traits: string | undefined,
    materials: string | undefined,
    fit: string | undefined,
    length: string | undefined,
    colors: string | undefined
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
            },
        ],
        accessori: [
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
            },
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
                colors: 'clothes_colors'

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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'

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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
            },

        ],
        accessori: [
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
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
                colors: 'clothes_colors'
            },
        ],
    },
};