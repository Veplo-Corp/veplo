
type Error = {
    name: string,
    path: string
}

export const handleErrorGraphQL = (error: Error) => {

    switch (error.name) {
        case 'the size you specified is not included in the sizes of the product variation':
            //location.reload()
            return {
                errorTitle: 'taglia inesistente',
                errorDescription: 'non siamo riusciti a trovare la taglia che hai selezionato',
            }

        case 'token id scaduto':
            return location.reload()
        default:
            return 'Ci dispiace ma non riusciamo a caricare la pagina. Riprova più tardi'
    }
}
