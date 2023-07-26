export const handleErrorFirebase = (error: string) => {
    switch (error) {
        case 'auth/email-already-in-use':
            return {
                title: 'Email già esistente',
                description: "impossibile registrare la mail perchè è già stata utilizzata una volta"
            }
        case 'auth/wrong-password':
        case 'Firebase: Error (auth/wrong-password).':
            return {
                title: 'Password errata',
                description: "la password inserita non è corretta"
            }
        case 'auth/user-not-found':
        case 'Firebase: Error (auth/user-not-found).':
            return {
                title: 'Email errata',
                description: "l'email inserita non è collegata a nessun account"
            }
        case 'auth/user-not-shop':
            return {
                title: 'Accesso da utente',
                description: "il tuo account non è abilitato come negozio"
            }

        case 'auth/too-many-requests':
        case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).':
            return {
                title: 'troppi tentativi errati, account temporaneamente disabilitato',
                description: "hai inserito troppe volte la password errata, riprova più tardi o resetta la password"
            }
        default:
            return {
                title: 'Si è verificato un errore!',
                description: "per ora è impossibile procedere. riprova più tardi"
            }

    }
}