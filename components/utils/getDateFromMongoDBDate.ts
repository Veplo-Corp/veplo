
export const getDateFromMongoDBDate = (date: string | undefined) => {
    console.log(date);
    if (!date) return 'data non trovata'
    return `${('0' + new Date(+date).getDate()).slice(-2)}/${('0' + (new Date(+date).getMonth() + 1)).slice(-2)}/${new Date(+date).getFullYear()}`
}