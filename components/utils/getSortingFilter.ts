import { Sort } from "../mook/sort_products";

export const getSortingFilter = (
    sortingString: Sort | string
): { ascending: boolean; for: string } | null => {
    if (sortingString === 'rilevanza') return null
    if (sortingString === 'prezzo-crescente') return { ascending: true, for: 'price' }
    if (sortingString === 'prezzo-decrescente') return { ascending: false, for: 'price' }
    if (sortingString === 'ultime-uscite') return { ascending: false, for: 'updatedAt' }
    return null


}   