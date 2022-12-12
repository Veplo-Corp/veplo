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
                    "dirndl",
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Camicie & Bluse",
                url: "camicie-e-bluse",
                types: ["camicie", "camiciette", "bluse"],
                sizes: "woman_clothes_sizes",
            },
            //!aggiunto costume: ["costumi"],
            {
                name: "Costume",
                url: "costume",
                types: [
                    "Costumi interi",
                    "Bikini"
                ],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "T-Shirt & Top",
                url: "t-shirt-e-top",
                types: ["top", "t-shirt", "polo", "a maniche lunghe"],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Pullover & Cardigan",
                url: "pullover-e-cardigan",
                types: ["pullover", "cardigan"],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Giacche & Blazer",
                url: "giacche-e-blazer",
                types: [
                    "leggere",
                    "impermeabili",
                    "di pelle",
                    "di jeans",
                    "blazer",
                    "mantelle",
                    "smanicati",
                    "giacche a vento",
                    "sportive",
                    "invernali",
                    "piumini corti",
                    "bomber",
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
                name: "Felpe",
                url: "felpe",
                types: ["felpe", "con il cappuccio", "con la zip", "pile"],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Jeans",
                url: "jeans",
                types: ["skinny", "slim", "a palazzo", "larghi", "a zampa d'elefante"],
                sizes: "woman_clothes_sizes",
            },
            {
                //!aggiunte scarpe donna
                name: "Scarpe",
                url: "scarpe",
                types: [
                    "Sneakers",
                    "Sandali",
                    "Scarpe piatte",
                    "Ciabatte e zoccoli",
                    "Scarpe con tacco",
                    "Tacchi alti",
                    "Ballerine",
                    "Stivaletti",
                    "Stivali",
                    "Scarpe sportive",
                    "Per il mare",
                    "Da sposa",
                    "Pantofole",
                    "Scarpe da trekking",
                    "Cura delle scarpe"],
                sizes: "shoes_sizes",
            },
            {
                name: "Shorts",
                url: "shorts",
                types: ["jeans", "sportivi"],
                sizes: "woman_clothes_sizes",
            },
            {
                name: "Pantaloni",
                url: "pantaloni",
                types: [
                    "chino",
                    "di stoffa",
                    "leggins",
                    "di pelle",
                    "cargo",
                    "salopette",
                    "tuta",
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
                    " di pelle",
                    "a portafoglio",
                ],
                sizes: "woman_clothes_sizes",
            },
        ],
        //accessori: ["accessori"],
        //costumi: ["costumi"],
    },
    uomo: {
        abbigliamento: [
            {
                name: "T-shirt & Polo",
                url: "t-shirt-e-polo",
                types: ["basic", "stampate", "canotte", "polo", "a maniche lunghe"],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Camicie",
                url: "camicie",
                types: ["casual", "eleganti"],
                sizes: "man_clothes_sizes",
            },
            //!aggiunto costume: ["costumi"],
            {
                name: "Costume",
                url: "costume",
                types: [
                    "Bermuda & Pantaloncini",
                    "Boxer mare",
                    "Slip"
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Felpe & Maglieria",
                url: "felpe-e-maglieria",
                types: ["con il cappuccio", "felpe", "con la zip", "di pile"],
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
                types: ["trench", "parka", "corti", "invernali", "classici", "piumini"],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Jeans",
                url: "jeans",
                types: [
                    "skinny",
                    "slim",
                    "a palazzo",
                    "affusolati",
                    "larghi",
                    "a zampa d'elefente",
                ],
                sizes: "man_clothes_sizes",
            },
            {
                name: "Pantaloni",
                url: "pantaloni",
                types: ["chino", "classici", "tuta", "cargo", "salopette"],
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
            {
                name: "Bermuda",
                url: "bermuda",
                types: ["casual", "sportivi", "cargo"],
                sizes: "man_clothes_sizes",
            },
        ],

    },
};