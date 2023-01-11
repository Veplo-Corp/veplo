export const handleErrorGraphQL = (error:string) => {
    console.log(error);
    
    switch (error) {
        case 'cap not found':
            return 'siamo spiacenti, ma non è presente ancora nessun negozio in questa zona'
        case 'the id provided is not a valid ObjectID':
            return 'siamo spiacenti, ma non siamo riusciti a trovare il prodotto'
        default:
            return 'siamo spiacenti, ma non riusciamo a caricare la pagina. Riprova più tardi'
    }
}