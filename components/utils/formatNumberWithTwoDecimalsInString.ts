export const formatNumberWithTwoDecimalsInString = (number: number | undefined | null): string => {
    if (typeof number !== 'number') return 'errore'
    if (Number.isInteger(number)) {
        return (number / 100).toFixed(2).replace(".", ","); // Restituisce il numero senza decimali
    } else {
        return (number / 100).toFixed(2).replace(".", ","); // Sostituisce il punto con la virgola
    }
};