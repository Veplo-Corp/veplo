export const formatPercentage = (number: number): string => {
    if (number < 0.01) {
        return number.toFixed(2);
    } else {
        return Math.floor(number).toString();
    }
};