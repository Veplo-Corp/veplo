export const findParamInURL = (params: string, URL: string | null): string | null => {
    if (!URL) return null

    // Trova l'indice iniziale del parametro "sizes"
    const indiceInizioParametro = URL.indexOf(params + '=');

    if (indiceInizioParametro !== -1) {
        // Se il parametro "sizes" è stato trovato, estrai il valore e restituiscilo
        const indiceFineParametro = URL.indexOf("&", indiceInizioParametro);
        const valoreSizes = indiceFineParametro !== -1
            ? URL.substring(indiceInizioParametro, indiceFineParametro)
            : URL.substring(indiceInizioParametro);

        return valoreSizes;
    } else {
        // Se il parametro "sizes" non è stato trovato, restituisci null
        return null;
    }
}