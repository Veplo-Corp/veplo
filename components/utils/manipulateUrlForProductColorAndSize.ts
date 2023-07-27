export const manipulateUrlForProductColorAndSize = (colorSelected: string | undefined, sizeSelected: string | undefined, updatedURL: string) => {

    const colorExists = updatedURL.includes('colors=');
    const sizesExist = updatedURL.includes('sizes=');

    if (colorSelected) {
        if (colorExists) {
            // Sostituisci il valore del parametro "color" con il colore fornito
            updatedURL = updatedURL.replace(/colors=[^&]+/, `colors=${colorSelected.toLocaleLowerCase()}`);
        } else {
            if (sizesExist) {
                // Aggiungi il parametro "color" con il colore fornito
                updatedURL += `&colors=${colorSelected.toLocaleLowerCase()}`;
            } else {
                // Aggiungi il parametro "color" con il colore fornito, gestendo il caso in cui ci siano già parametri o meno
                updatedURL += updatedURL.includes('?') ? `&colors=${colorSelected.toLocaleLowerCase()}` : `?colors=${colorSelected.toLocaleLowerCase()}`;
            }
        }
    }

    if (sizeSelected) {
        if (sizesExist) {
            // Sostituisci il valore del parametro "sizes" con il valore di sizeSelected
            updatedURL = updatedURL.replace(/sizes=[^&]+/, `sizes=${sizeSelected}`);
        } else {
            if (colorExists) {
                // Aggiungi il parametro "sizes" con il valore di sizeSelected
                updatedURL += `&sizes=${sizeSelected}`;
            } else {
                // Aggiungi il parametro "sizes" con il valore di sizeSelected, gestendo il caso in cui ci siano già parametri o meno
                updatedURL += updatedURL.includes('?') ? `&sizes=${sizeSelected}` : `?sizes=${sizeSelected}`;
            }
        }
    }

    return updatedURL;
}