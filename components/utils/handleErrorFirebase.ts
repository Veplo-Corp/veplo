export const handleErrorFirebase = (error:string) => {
    switch (error) {
        case 'auth/email-already-in-use':
            return {
                title: 'Email già esistente',
                description: "impossibile registrare la mail perchè hai già effettuato l'accesso"
            }
        case 'auth/wrong-password':
            return {
                title: 'Password errata',
                description: "la password inserita non è corretta"
            }
        case 'auth/user-not-found':
            return {
                title: 'Email errata',
                description: "l'email inserita non è collegata a nessun account"
            }
        case 'auth/user-not-shop':
            return {
                title: 'Accesso da utente',
                description: "il tuo account non è abilitato come negozio"
            }
        default:
            return {
                title: 'Si è verificato un errore!',
                description: "per ora è impossibile procedere. riprova più tardi"
            }

    }
}