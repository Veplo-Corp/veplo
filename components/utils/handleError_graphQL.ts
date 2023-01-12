export const handleErrorGraphQL = (error:string) => {
    console.log(error);
    
    switch (error) {
        case 'cap not found':
            return 'Ci dispiace ma non è presente ancora nessun negozio in questa zona'
        case 'the id provided is not a valid ObjectID':
            return 'Ci dispiace ma non siamo riusciti a trovare il prodotto'
        default:
            return 'Ci dispiace ma non riusciamo a caricare la pagina. Riprova più tardi'
    }
}