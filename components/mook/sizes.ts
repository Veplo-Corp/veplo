export const woman_clothes_sizes = [
  "xxs (36)",
  "xs (38)",
  "s (40)",
  "m (42)",
  "l (44)",
  "xl (46)",
  "xxl (48)",
  "3xl (50)",
  "4xl (52)",
  "5xl (54)",
];

export const man_clothes_sizes = [
  "xs (44)",
  "s (46)",
  "m (48)",
  "l (50)",
  "xl (52)",
  "xxl (54)",
  "3xl (56)",
  "4xl (58)",
];

//! delete man bottom clothes and man top Clothes -> add unique man_clothes_sizes
//!

export const shoes_sizes = [
  "35",
  "35.5",
  "36",
  "36.5",
  "37",
  "37.5",
  "38",
  "38.5",
  "39",
  "39.5",
  "40",
  "40.5",
  "41",
  "41.5",
  "42",
  "42.5",
  "43",
  "43.5",
  "44",
  "44.5",
  "45",
  "45.5",
  "46",
  "46.5",
  "47",
  "47.5",
  "48",
  "48.5",
  "49",
  "49.5",
  "50",
];

//woman_shoes_sizes
//man_shoes_sizes

export interface Sizes {
  woman_clothes_sizes: string[]
  man_clothes_sizes: string[]
  shoes_sizes: string[]
}


export const SIZES: Sizes = {
  woman_clothes_sizes: [
    "xxs (36)",
    "xs (38)",
    "s (40)",
    "m (42)",
    "l (44)",
    "xl (46)",
    "xxl (48)",
    "3xl (50)",
    "4xl (52)",
    "5xl (54)",
  ],
  man_clothes_sizes: [
    "xs (44)",
    "s (46)",
    "m (48)",
    "l (50)",
    "xl (52)",
    "xxl (54)",
    "3xl (56)",
    "4xl (58)",
  ],
  shoes_sizes: [
    "35",
    "35.5",
    "36",
    "36.5",
    "37",
    "37.5",
    "38",
    "38.5",
    "39",
    "39.5",
    "40",
    "40.5",
    "41",
    "41.5",
    "42",
    "42.5",
    "43",
    "43.5",
    "44",
    "44.5",
    "45",
    "45.5",
    "46",
    "46.5",
    "47",
    "47.5",
    "48",
    "48.5",
    "49",
    "49.5",
    "50",
  ]
}