import { sendEmailVerification } from './utils';

describe('unit test sendEmailVerification', () => {
    test('when response is true', () => {
        const response = true;
        const functionReturn = {
            position: 'top',
            title: 'Email inviata con successo',
            description: 'controlla la tua casella mail',
            status: 'info',
            duration: 5000,
            isClosable: true
        }
        expect(sendEmailVerification(response)).toStrictEqual(functionReturn)
    });

    test('when response is auth/too-many-requests', () => {
        const response = 'auth/too-many-requests';
        const functionReturn = {
            position: 'top',
            title: 'Hai effettuato troppe richieste',
            description: 'hai richiesto troppe volte la mail di convalida, controlla la tua casella mail',
            status: 'error',
            duration: 5000,
            isClosable: true
        }
        expect(sendEmailVerification(response)).toStrictEqual(functionReturn)
    });

    test('when response is different than true or auth/too-many-requests', () => {
        const response = false;
        const functionReturn = {
            position: 'top',
            title: 'Impossibile inviare email',
            description: 'non riusciamo a inviarti la mail, riprova più tardi',
            status: 'warning', duration: 5000,
            isClosable: true
        }
        expect(sendEmailVerification(response)).toStrictEqual(functionReturn)
    });
});
