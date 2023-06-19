import { findMacrocategoryName } from "./find_macrocategory_name";
import { findMicrocategoryName } from "./find_microcategory_name";

export interface ParsedURL {
    gender: string;
    macroCategory: string | null;
    microCategory: string | null;
    //sorting: string;
}



export const parseURLProducts = (urlSegments: string[]): ParsedURL | Error => {
    const numSegments: number = urlSegments.length;

    if (numSegments !== 3) {
        return new Error('Array non valido. Assicurati che ci siano esattamente 3 elementi.');
    }

    const categories: string[] = urlSegments[0].split('-'); // Dividi il segmento delle categorie in base al trattino "-"
    const numCategories: number = categories.length;

    if (numCategories < 2) {
        return new Error('Array non valido. Manca la sottocategoria.');
    }

    const gender: string = categories[0] === 'uomo' ? 'm' : 'f'; // Prendi la prima parte come categoria
    const macroCategory: string | null = findMacrocategoryName(categories.slice(1).join('-'), gender); // Prendi le parti rimanenti come sottocategoria

    const microCategory: string | null = findMicrocategoryName(macroCategory || '', gender, urlSegments[1]); // La microcategoria è il secondo elemento dell'array
    //const sorting: string = urlSegments[2]; // L'ordinamento è il terzo elemento dell'array

    return {
        gender,
        macroCategory,
        microCategory,
        //sorting
    };
}