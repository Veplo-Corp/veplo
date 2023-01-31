export type Category = {
    name: string,
    url: string,
    types: string[],
    sizes: string
}

export type Categories = {
    donna:
    {
        abbigliamento: Category[]
    }
    uomo:
    {
        abbigliamento: Category[]
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
                    "casual",
                    "eleganti",
                    "per occasioni speciali",
                    "caftani e camicia",
                    "maglina",
                    "tubini",
                    "lunghi",
                    "di jeans",
                    "di maglia",
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "T-Shirt & Top",
                url: "t-shirt-e-top",
                types: [
                    "top",
                    "t-shirt",
                    "polo",
                    "a maniche lunghe"
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Camicie e Bluse", //Camicie & Bluse
                url: "camicie-e-bluse",
                types: [
                    "camicie",
                    "camiciette",
                    "bluse"
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Pantaloni",
                url: "pantaloni",
                types: [
                    "chino",
                    "di stoffa",
                    "leggins",
                    "pantaloni di pelle",
                    "pantaloni cargo",
                    "salopette",
                    "tuta",
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Jeans",
                url: "jeans",
                types: [
                    "skinny",
                    "slim",
                    "a palazzo",
                    "shorts",
                    "larghi",
                    "diritti",
                    "jeans a zampa d'elefante"
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Felpe",
                url: "felpe",
                types: [
                    "felpe",
                    "con il cappuccio",
                    "con la zip",
                    "pile"
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Giacche & Blazer",
                url: "giacche-e-blazer",
                types: [
                    "giacche leggere",
                    "giacche impermeabili",
                    "di pelle",
                    "di jeans",
                    "blazer",
                    "mantelle",
                    "smanicati",
                    "giacche a vento",
                    "sportive",
                    "invernali",
                    "piumini corti",
                    "giacche bomber",
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Cappotti",
                url: "cappotti",
                types: [
                    "parka",
                    "trench",
                    "corti",
                    "classici",
                    "invernali",
                    "piumini lunghi",
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Maglieria",
                url: "pullover-e-cardigan",
                types: ["pullover", "cardigan"],
                sizes: "woman_clothes_sizes",
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
            },
            {
                name: "Gonne",
                url: "gonne",
                types: [
                    "jeans",
                    "lunghe",
                    "a pieghe",
                    "a trapezio",
                    "minigonne",
                    "a tubino",
                    "di pelle",
                    "a portafoglio",
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Shorts",
                url: "shorts",
                types: ["jeans", "sportivi"],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Abbigliamento sportivo",
                url: "abbigliamento-sportivo",
                types:
                    [
                        "t-shirt & Polo",
                        "pantaloni",
                        "reggiseni",
                        "giacche & Coprispalla",
                        "felpe",
                        "tute sportive",
                        "moda Mare",
                        "vestiti & Gonne",
                        "calzini",
                        "intimo e strati base",
                        "merchandising ufficiale"
                    ],
                sizes: "woman_clothes_sizes",
            },
            {
                //!aggiunte scarpe donna
                name: "Scarpe",
                url: "scarpe",
                types: [
                    "sneakers",
                    "sandali",
                    "scarpe piatte",
                    "ciabatte e zoccoli",
                    "scarpe con tacco",
                    "tacchi alti",
                    "ballerine",
                    "stivaletti",
                    "stivali",
                    "scarpe sportive",
                    "per il mare",
                    "da sposa",
                    "pantofole",
                    "scarpe da trekking",
                    "cura delle scarpe"],
                sizes: "shoes_sizes",
            },
        ],
    },
    uomo: {
        abbigliamento: [
            {
                name: "T-shirt & Polo",
                url: "t-shirt-e-polo",
                types: [
                    "basic",
                    "stampate",
                    "canotte",
                    "polo",
                    "a maniche lunghe"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Camicie",
                url: "camicie",
                types: [
                    "casual",
                    "eleganti"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Felpe & Maglieria",
                url: "felpe-e-maglieria",
                types: [
                    "con il cappuccio",
                    "felpe",
                    "con la zip",
                    "di pile",
                    "cardigan",
                    "pullover"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Jeans",
                url: "jeans",
                types: [
                    "skinny",
                    "slim fit",
                    "a palazzo",
                    "a gamba dritta",
                    "jeans affusolati",
                    "taglio largo",
                    "a zampa d'elefente",
                    "jeans shorts"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Pantaloni",
                url: "pantaloni",
                types: [
                    "chino",
                    "classici",
                    "pantaloni tuta",
                    "cargo",
                    "salopette"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Bermuda",
                url: "bermuda",
                types: [
                    "short casual",
                    "jeans corti",
                    "pantaloncini sportivi"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Abbigliamento sportivo",
                url: "abbigliamento-sportivo",
                types: [
                    "Magliette",
                    "Pantaloni sportivi",
                    "Giacche & Gilet",
                    "Completi da allenamento",
                    "Felpe",
                    "Merchandising ufficiale",
                    "Calze & calzini",
                    "Moda mare & surf",
                    "Intimo e strati base"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Giacche",
                url: "giacche",
                types: [
                    "leggere",
                    "di pelle",
                    "di jeans",
                    "invernali",
                    "piumini",
                    "giacche a vento",
                    "di pile",
                    "gilet",
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Cappotti",
                url: "cappotti",
                types: [
                    "trench",
                    "parka",
                    "corti",
                    "invernali",
                    "classici",
                    "piumini"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Scarpe",
                url: "scarpe",
                types: [
                    "Sneaker",
                    "Scarpe sportive",
                    "Scarpe aperte",
                    "Scarpe con i lacci",
                    "Scarpe basse",
                    "Scarpe eleganti",
                    "Scarpe per outdoor",
                    "Stivaletti/Stivali",
                    "Pantofole",
                    "Accessori per le scarpe",
                ],
                sizes: "shoes_sizes",
            },
            //!aggiunto costumi: ["costumi"],
            {
                name: "Costumi",
                url: "costumi",
                types: [
                    "Bermuda & Pantaloncini",
                    "Boxer mare",
                    "Slip"
                ],
                sizes: "man_clothes_sizes",
            },
        ],
    },
};