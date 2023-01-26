import { AddToast } from './../../utils/Toast';


export const sendEmailVerification = (response: any) => {
    if (response === true) {
        return <AddToast>{
            position: 'top',
            title: 'Email inviata con successo',
            description: 'controlla la tua casella mail',
            status: 'info',
            duration: 5000,
            isClosable: true
        }
    }
    if (response === 'auth/too-many-requests') {
        return <AddToast>{
            position: 'top',
            title: 'Hai effettuato troppe richieste',
            description: 'hai richiesto troppe volte la mail di convalida, controlla la tua casella mail',
            status: 'error',
            duration: 5000,
            isClosable: true

        }
    }
    return <AddToast>{
        position: 'top',
        title: 'Impossibile inviare email',
        description: 'non riusciamo a inviarti la mail, riprova più tardi',
        status: 'warning', duration: 5000,
        isClosable: true
    }
}