
export const getDateFromMongoDBDate = (dateString: string | undefined): string => {
    // console.log(date);
    if (!dateString) return 'data non trovata'
    // return `${('0' + new Date(+date).getDate()).slice(-2)}/${('0' + (new Date(+date).getMonth() + 1)).slice(-2)}/${new Date(+date).getFullYear()}`
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
}