type SIZE = {
    name: string,
    sizes: any,
    category?: any
}[]


export const GUIDE_SIZES: SIZE = [
    {
        name: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_MAN_CLOTHES_SIZES',
        category: [
            'pantaloni',
            'jeans',
            'bermuda',
            'costumi'
        ],
        sizes: [
            {
                "EU": "XXS",
                "IT": 42,
                "Girovita (cm)": "70-73",
                "Fianchi (cm)": "84-87"
            },
            {
                "EU": "XS",
                "IT": 44,
                "Girovita (cm)": "74-77",
                "Fianchi (cm)": "88-91"
            },
            {
                "EU": "S",
                "IT": 46,
                "Girovita (cm)": "78-81",
                "Fianchi (cm)": "92-95"
            },
            {
                "EU": "M",
                "IT": 48,
                "Girovita (cm)": "82-85",
                "Fianchi (cm)": "96-99"
            },
            {
                "EU": "L",
                "IT": 50,
                "Girovita (cm)": "86-89",
                "Fianchi (cm)": "100-103"
            },
            {
                "EU": "XL",
                "IT": 52,
                "Girovita (cm)": "90-94",
                "Fianchi (cm)": "104-107"
            },
            {
                "EU": "XXL",
                "IT": 54,
                "Girovita (cm)": "95-99",
                "Fianchi (cm)": "108-111"
            },
            {
                "EU": "3XL",
                "IT": 56,
                "Girovita (cm)": "100-104",
                "Fianchi (cm)": "112-115"
            },
            {
                "EU": "4XL",
                "IT": 58,
                "Girovita (cm)": "105-109",
                "Fianchi (cm)": "116-119"
            }
        ]
    },
    {
        name: 'DEFAULT_GUIDE_MAN_CLOTHES_SIZES',
        category: [
            'defualt'
        ],
        sizes: [
            {
                "EU": "XXS",
                "Petto (cm)": "86-89",
                "Girovita (cm)": "74-77",
                "Fianchi (cm)": "90-93"
            },
            {
                "EU": "XS",
                "Petto (cm)": "90-93",
                "Girovita (cm)": "78-81",
                "Fianchi (cm)": "94-97"
            },
            {
                "EU": "S",
                "Petto (cm)": "94-97",
                "Girovita (cm)": "82-85",
                "Fianchi (cm)": "98-101"
            },
            {
                "EU": "M",
                "Petto (cm)": "98-101",
                "Girovita (cm)": "86-89",
                "Fianchi (cm)": "102-105"
            },
            {
                "EU": "L",
                "Petto (cm)": "102-105",
                "Girovita (cm)": "90-93",
                "Fianchi (cm)": "106-109"
            },
            {
                "EU": "XL",
                "Petto (cm)": "106-109",
                "Girovita (cm)": "94-97",
                "Fianchi (cm)": "110-113"
            },
            {
                "EU": "XXL",
                "Petto (cm)": "110-113",
                "Girovita (cm)": "98-101",
                "Fianchi (cm)": "114-117"
            },
            {
                "EU": "3XL",
                "Petto (cm)": "114-117",
                "Girovita (cm)": "102-105",
                "Fianchi (cm)": "118-121"
            },
            {
                "EU": "4XL",
                "Petto (cm)": "118-121",
                "Girovita (cm)": "106-109",
                "Fianchi (cm)": "122-125"
            }
        ]
    },
    {
        name: "JEWELLERY_MAN_SIZES",
        sizes: [
            {
                "IT": 56,
                "INT": "XS",
                "EU": 56,
                "FR": 56,
                "UK": "P"
            },
            {
                "IT": 57,
                "INT": "XS",
                "EU": 57,
                "FR": 57,
                "UK": "Q"
            },
            {
                "IT": 58,
                "INT": "S",
                "EU": 58,
                "FR": 58,
                "UK": "Q-R"
            },
            {
                "IT": 59,
                "INT": "S",
                "EU": 59,
                "FR": 59,
                "UK": "R"
            },
            {
                "IT": 60,
                "INT": "S",
                "EU": 60,
                "FR": 60,
                "UK": "S"
            },
            {
                "IT": 61,
                "INT": "M",
                "EU": 61,
                "FR": 61,
                "UK": "T"
            },
            {
                "IT": 62,
                "INT": "M",
                "EU": 62,
                "FR": 62,
                "UK": "T-U"
            },
            {
                "IT": 63,
                "INT": "M",
                "EU": 63,
                "FR": 63,
                "UK": "U"
            },
            {
                "IT": 64,
                "INT": "M",
                "EU": 64,
                "FR": 64,
                "UK": "V"
            },
            {
                "IT": 65,
                "INT": "L",
                "EU": 65,
                "FR": 65,
                "UK": "W"
            },
            {
                "IT": 66,
                "INT": "L",
                "EU": 66,
                "FR": 66,
                "UK": "X"
            },
            {
                "IT": 67,
                "INT": "L",
                "EU": 67,
                "FR": 67,
                "UK": "X-Y"
            },
            {
                "IT": 68,
                "INT": "XL",
                "EU": 68,
                "FR": 68,
                "UK": "Y"
            }
        ]
    },
    {
        name: 'CAP_MAN_SIZES',
        sizes: [
            {
                "IT": 52,
                "INT": "XS",
                "EU": 52,
                "FR": 52,
                "UK": "6 3/8"
            },
            {
                "IT": 53,
                "INT": "XS",
                "EU": 53,
                "FR": 53,
                "UK": "6 1/2"
            },
            {
                "IT": 54,
                "INT": "S",
                "EU": 54,
                "FR": 54,
                "UK": "6 5/8"
            },
            {
                "IT": 55,
                "INT": "S",
                "EU": 55,
                "FR": 55,
                "UK": "6 3/4"
            },
            {
                "IT": 56,
                "INT": "M",
                "EU": 56,
                "FR": 56,
                "UK": "6 7/8"
            },
            {
                "IT": 57,
                "INT": "M",
                "EU": 57,
                "FR": 57,
                "UK": 7
            },
            {
                "IT": 58,
                "INT": "L",
                "EU": 58,
                "FR": 58,
                "UK": "7 1/8"
            },
            {
                "IT": 59,
                "INT": "L",
                "EU": 59,
                "FR": 59,
                "UK": "7 1/4"
            },
            {
                "IT": 60,
                "INT": "XL",
                "EU": 60,
                "FR": 60,
                "UK": "7 3/8"
            },
            {
                "IT": 61,
                "INT": "XL",
                "EU": 61,
                "FR": 61,
                "UK": "7 1/2"
            },
            {
                "IT": 62,
                "INT": "XXL",
                "EU": 62,
                "FR": 62,
                "UK": "7 5/8"
            },
            {
                "IT": 63,
                "INT": "XXL",
                "EU": 63,
                "FR": 63,
                "UK": "7 3/4"
            },
            {
                "IT": 64,
                "INT": "XXXL",
                "EU": 64,
                "FR": 64,
                "UK": "7 7/8"
            }
        ]
    },
    {
        name: 'BELT_MAN_SIZES',
        sizes: [
            {
                "IT": 70,
                "INT": "XXS",
                "EU": 70,
                "FR": 70,
                "UK": 28
            },
            {
                "IT": 75,
                "INT": "XXS/XS",
                "EU": 75,
                "FR": 75,
                "UK": 30
            },
            {
                "IT": 80,
                "INT": "XS",
                "EU": 80,
                "FR": 80,
                "UK": 32
            },
            {
                "IT": 85,
                "INT": "S",
                "EU": 85,
                "FR": 85,
                "UK": 34
            },
            {
                "IT": 90,
                "INT": "S/M",
                "EU": 90,
                "FR": 90,
                "UK": 36
            },
            {
                "IT": 95,
                "INT": "M",
                "EU": 95,
                "FR": 95,
                "UK": 38
            },
            {
                "IT": 100,
                "INT": "L",
                "EU": 100,
                "FR": 100,
                "UK": 40
            },
            {
                "IT": 105,
                "INT": "XL/XXL",
                "EU": 105,
                "FR": 105,
                "UK": 42
            },
            {
                "IT": 110,
                "INT": "3XL",
                "EU": 110,
                "FR": 110,
                "UK": 44
            }
        ]
    },
    {
        name: "GLOVES_MAN_SIZES",
        sizes: [
            {
                "IT": 5.5,
                "Label": "XS"
            },
            {
                "IT": 6,
                "Label": "S"
            },
            {
                "IT": 6.5,
                "Label": "S"
            },
            {
                "IT": 7,
                "Label": "S"
            },
            {
                "IT": 7.5,
                "Label": "S"
            },
            {
                "IT": 8,
                "Label": "M"
            },
            {
                "IT": 8.5,
                "Label": "M"
            },
            {
                "IT": 9,
                "Label": "M"
            },
            {
                "IT": 9.5,
                "Label": "M"
            },
            {
                "IT": 10,
                "Label": "L"
            },
            {
                "IT": 10.5,
                "Label": "L"
            },
            {
                "IT": 11,
                "Label": "L"
            }
        ]
    },
    {
        name: 'ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES',
        category: [
            'pantaloni',
            'jeans',
            'gonne',
            'costumi'
        ],
        sizes:
            [
                {
                    "EU": "XXS",
                    "IT": 36,
                    "Girovita (cm)": "60-62",
                    "Fianchi (cm)": "81-84"
                },
                {
                    "EU": "XS",
                    "IT": 38,
                    "Girovita (cm)": "63-65",
                    "Fianchi (cm)": "85-88"
                },
                {
                    "EU": "S",
                    "IT": 40,
                    "Girovita (cm)": "66-68",
                    "Fianchi (cm)": "89-92"
                },
                {
                    "EU": "M",
                    "IT": 42,
                    "Girovita (cm)": "69-71",
                    "Fianchi (cm)": "93-96"
                },
                {
                    "EU": "L",
                    "IT": 44,
                    "Girovita (cm)": "72-75",
                    "Fianchi (cm)": "97-99"
                },
                {
                    "EU": "XL",
                    "IT": 46,
                    "Girovita (cm)": "76-79",
                    "Fianchi (cm)": "100-102"
                },
                {
                    "EU": "XXL",
                    "IT": 48,
                    "Girovita (cm)": "80-82",
                    "Fianchi (cm)": "103-105"
                },
                {
                    "EU": "3XL",
                    "IT": 50,
                    "Girovita (cm)": "83-86",
                    "Fianchi (cm)": "106-107"
                },
                {
                    "EU": "4XL",
                    "IT": 52,
                    "Girovita (cm)": "87-90",
                    "Fianchi (cm)": "108-111"
                },
                {
                    "EU": "5XL",
                    "IT": 54,
                    "Girovita (cm)": "91-94",
                    "Fianchi (cm)": "112-115"
                }
            ]
    },
    {
        name: 'DEFAULT_GUIDE_WOMAN_CLOTHES_SIZES',
        category: [
            'defualt'
        ],

        sizes: [
            {
                "EU": "XXS",
                "IT": 36,
                "Petto (cm)": "72-75",
                "Girovita (cm)": "60-62",
                "Fianchi (cm)": "81-84"
            },
            {
                "EU": "XS",
                "IT": 38,
                "Petto (cm)": "76-79",
                "Girovita (cm)": "63-65",
                "Fianchi (cm)": "85-88"
            },
            {
                "EU": "S",
                "IT": 40,
                "Petto (cm)": "80-83",
                "Girovita (cm)": "66-68",
                "Fianchi (cm)": "89-92"
            },
            {
                "EU": "M",
                "IT": 42,
                "Petto (cm)": "84-87",
                "Girovita (cm)": "69-71",
                "Fianchi (cm)": "93-96"
            },
            {
                "EU": "L",
                "IT": 44,
                "Petto (cm)": "88-91",
                "Girovita (cm)": "72-75",
                "Fianchi (cm)": "97-99"
            },
            {
                "EU": "XL",
                "IT": 46,
                "Petto (cm)": "92-95",
                "Girovita (cm)": "76-79",
                "Fianchi (cm)": "100-102"
            },
            {
                "EU": "XXL",
                "IT": 48,
                "Petto (cm)": "96-99",
                "Girovita (cm)": "80-82",
                "Fianchi (cm)": "103-105"
            },
            {
                "EU": "3XL",
                "IT": 50,
                "Petto (cm)": "100-103",
                "Girovita (cm)": "83-86",
                "Fianchi (cm)": "106-107"
            },
            {
                "EU": "4XL",
                "IT": 52,
                "Petto (cm)": "104-107",
                "Girovita (cm)": "87-90",
                "Fianchi (cm)": "108-111"
            },
            {
                "EU": "5XL",
                "IT": 54,
                "Petto (cm)": "108-111",
                "Girovita (cm)": "91-94",
                "Fianchi (cm)": "112-115"
            }
        ]
    },
    {
        name: 'JEWELLERY_WOMAN_SIZES',
        sizes: [
            {
                "IT": 48,
                "INT": "XS",
                "EU": 48,
                "FR": 48,
                "UK": "I-J"
            },
            {
                "IT": 49,
                "INT": "XS",
                "EU": 49,
                "FR": 49,
                "UK": "J"
            },
            {
                "IT": 50,
                "INT": "S",
                "EU": 50,
                "FR": 50,
                "UK": "K"
            },
            {
                "IT": 51,
                "INT": "S",
                "EU": 51,
                "FR": 51,
                "UK": "L"
            },
            {
                "IT": 52,
                "INT": "M",
                "EU": 52,
                "FR": 52,
                "UK": "M"
            },
            {
                "IT": 53,
                "INT": "M",
                "EU": 53,
                "FR": 53,
                "UK": "N"
            },
            {
                "IT": 54,
                "INT": "M",
                "EU": 54,
                "FR": 54,
                "UK": "N-O"
            },
            {
                "IT": 55,
                "INT": "L",
                "EU": 55,
                "FR": 55,
                "UK": "O"
            },
            {
                "IT": 56,
                "INT": "L",
                "EU": 56,
                "FR": 56,
                "UK": "P"
            },
            {
                "IT": 57,
                "INT": "L",
                "EU": 57,
                "FR": 57,
                "UK": "Q"
            },
            {
                "IT": 58,
                "INT": "XL",
                "EU": 58,
                "FR": 58,
                "UK": "Q-R"
            },
            {
                "IT": 59,
                "INT": "XL",
                "EU": 59,
                "FR": 59,
                "UK": "R"
            },
            {
                "IT": 60,
                "INT": "XL",
                "EU": 60,
                "FR": 60,
                "UK": "S"
            },
            {
                "IT": 61,
                "INT": "XL",
                "EU": 61,
                "FR": 61,
                "UK": "T"
            }
        ]
    },
    {
        name: "CAP_WOMAN_SIZES",
        sizes: [
            {
                "IT": 52,
                "INT": "XS",
                "EU": 52,
                "FR": 52,
                "UK": "6 3/8"
            },
            {
                "IT": 53,
                "INT": "XS",
                "EU": 53,
                "FR": 53,
                "UK": "6 1/2"
            },
            {
                "IT": 54,
                "INT": "S",
                "EU": 54,
                "FR": 54,
                "UK": "6 5/8"
            },
            {
                "IT": 55,
                "INT": "S",
                "EU": 55,
                "FR": 55,
                "UK": "6 3/4"
            },
            {
                "IT": 56,
                "INT": "M",
                "EU": 56,
                "FR": 56,
                "UK": "6 7/8"
            },
            {
                "IT": 57,
                "INT": "M",
                "EU": 57,
                "FR": 57,
                "UK": 7
            },
            {
                "IT": 58,
                "INT": "L",
                "EU": 58,
                "FR": 58,
                "UK": "7 1/8"
            },
            {
                "IT": 59,
                "INT": "L",
                "EU": 59,
                "FR": 59,
                "UK": "7 1/4"
            },
            {
                "IT": 60,
                "INT": "XL",
                "EU": 60,
                "FR": 60,
                "UK": "7 3/8"
            },
            {
                "IT": 61,
                "INT": "XL",
                "EU": 61,
                "FR": 61,
                "UK": "7 1/2"
            },
            {
                "IT": 62,
                "INT": "XXL",
                "EU": 62,
                "FR": 62,
                "UK": "7 5/8"
            },
            {
                "IT": 63,
                "INT": "XXL",
                "EU": 63,
                "FR": 63,
                "UK": "7 3/4"
            },
            {
                "IT": 64,
                "INT": "XXXL",
                "EU": 64,
                "FR": 64,
                "UK": "7 7/8"
            }
        ]
    },
    {
        name: "BELT_WOMAN_SIZES",
        sizes: [
            {
                "IT": 60,
                "INT": "XXS",
                "EU": 60,
                "FR": 60,
                "UK": 24
            },
            {
                "IT": 65,
                "INT": "XS",
                "EU": 65,
                "FR": 65,
                "UK": 26
            },
            {
                "IT": 70,
                "INT": "XS/S",
                "EU": 70,
                "FR": 70,
                "UK": 28
            },
            {
                "IT": 75,
                "INT": "S",
                "EU": 75,
                "FR": 75,
                "UK": 30
            },
            {
                "IT": 80,
                "INT": "M",
                "EU": 80,
                "FR": 80,
                "UK": 32
            },
            {
                "IT": 85,
                "INT": "L",
                "EU": 85,
                "FR": 85,
                "UK": 34
            },
            {
                "IT": 90,
                "INT": "L/XL",
                "EU": 90,
                "FR": 90,
                "UK": 36
            },
            {
                "IT": 95,
                "INT": "XL",
                "EU": 95,
                "FR": 95,
                "UK": 38
            },
            {
                "IT": 100,
                "INT": "XXL",
                "EU": 100,
                "FR": 100,
                "UK": 40
            },
            {
                "IT": 105,
                "INT": "XXL",
                "EU": 105,
                "FR": 105,
                "UK": 42
            },
            {
                "IT": 110,
                "INT": "3XL",
                "EU": 110,
                "FR": 110,
                "UK": 44
            }
        ]
    },
    {
        name: "GLOVES_WOMAN_SIZES",
        sizes: [
            {
                "IT": 5.5,
                "INT": "XS",
                "EU": 5.5,
                "FR": 5.5,
                "UK": 5.5
            },
            {
                "IT": 6,
                "INT": "XS",
                "EU": 6,
                "FR": 6,
                "UK": 6
            },
            {
                "IT": 6.5,
                "INT": "S",
                "EU": 6.5,
                "FR": 6.5,
                "UK": 6.5
            },
            {
                "IT": 7,
                "INT": "M",
                "EU": 7,
                "FR": 7,
                "UK": 7
            },
            {
                "IT": 7.5,
                "INT": "L",
                "EU": 7.5,
                "FR": 7.5,
                "UK": 7.5
            },
            {
                "IT": 8,
                "INT": "XL",
                "EU": 8,
                "FR": 8,
                "UK": 8
            },
            {
                "IT": 8.5,
                "INT": "XXL",
                "EU": 8.5,
                "FR": 8.5,
                "UK": 8.5
            }
        ]
    }

]



// export const ONLY_TROUSERS_AND_SKIRT_GUIDE_WOMAN_CLOTHES_SIZES =
//     [
//         {
//             "EU": "XXS",
//             "IT": 36,
//             "Petto (cm)": "72-75",
//             "Girovita (cm)": "60-62",
//             "Fianchi (cm)": "81-84"
//         },
//         {
//             "EU": "XS",
//             "IT": 38,
//             "Petto (cm)": "76-79",
//             "Girovita (cm)": "63-65",
//             "Fianchi (cm)": "85-88"
//         },
//         {
//             "EU": "S",
//             "IT": 40,
//             "Petto (cm)": "80-83",
//             "Girovita (cm)": "66-68",
//             "Fianchi (cm)": "89-92"
//         },
//         {
//             "EU": "M",
//             "IT": 42,
//             "Petto (cm)": "84-87",
//             "Girovita (cm)": "69-71",
//             "Fianchi (cm)": "93-96"
//         },
//         {
//             "EU": "L",
//             "IT": 44,
//             "Petto (cm)": "88-91",
//             "Girovita (cm)": "72-75",
//             "Fianchi (cm)": "97-99"
//         },
//         {
//             "EU": "XL",
//             "IT": 46,
//             "Petto (cm)": "92-95",
//             "Girovita (cm)": "76-79",
//             "Fianchi (cm)": "100-102"
//         },
//         {
//             "EU": "XXL",
//             "IT": 48,
//             "Petto (cm)": "96-99",
//             "Girovita (cm)": "80-82",
//             "Fianchi (cm)": "103-105"
//         },
//         {
//             "EU": "3XL",
//             "IT": 50,
//             "Petto (cm)": "100-103",
//             "Girovita (cm)": "83-86",
//             "Fianchi (cm)": "106-107"
//         },
//         {
//             "EU": "4XL",
//             "IT": 52,
//             "Petto (cm)": "104-107",
//             "Girovita (cm)": "87-90",
//             "Fianchi (cm)": "108-111"
//         },
//         {
//             "EU": "5XL",
//             "IT": 54,
//             "Petto (cm)": "108-111",
//             "Girovita (cm)": "91-94",
//             "Fianchi (cm)": "112-115"
//         }
//     ]

// export const DEFAULT_GUIDE_WOMAN_CLOTHES_SIZES = [
//     {
//         "EU": "XXS",
//         "IT": 36,
//         "Girovita (cm)": "60-62",
//         "Fianchi (cm)": "81-84"
//     },
//     {
//         "EU": "XS",
//         "IT": 38,
//         "Girovita (cm)": "63-65",
//         "Fianchi (cm)": "85-88"
//     },
//     {
//         "EU": "S",
//         "IT": 40,
//         "Girovita (cm)": "66-68",
//         "Fianchi (cm)": "89-92"
//     },
//     {
//         "EU": "M",
//         "IT": 42,
//         "Girovita (cm)": "69-71",
//         "Fianchi (cm)": "93-96"
//     },
//     {
//         "EU": "L",
//         "IT": 44,
//         "Girovita (cm)": "72-75",
//         "Fianchi (cm)": "97-99"
//     },
//     {
//         "EU": "XL",
//         "IT": 46,
//         "Girovita (cm)": "76-79",
//         "Fianchi (cm)": "100-102"
//     },
//     {
//         "EU": "XXL",
//         "IT": 48,
//         "Girovita (cm)": "80-82",
//         "Fianchi (cm)": "103-105"
//     },
//     {
//         "EU": "3XL",
//         "IT": 50,
//         "Girovita (cm)": "83-86",
//         "Fianchi (cm)": "106-107"
//     },
//     {
//         "EU": "4XL",
//         "IT": 52,
//         "Girovita (cm)": "87-90",
//         "Fianchi (cm)": "108-111"
//     },
//     {
//         "EU": "5XL",
//         "IT": 54,
//         "Girovita (cm)": "91-94",
//         "Fianchi (cm)": "112-115"
//     }
// ]

