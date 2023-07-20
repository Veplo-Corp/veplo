export const formatNumberWithTwoDecimalsInNumber = (number: number): number => {
    if (Number.isInteger(number)) {
        return (number / 100); // Restituisce il numero senza decimali
    } else {
        return (number / 100); // Sostituisce il punto con la virgola
    }
};