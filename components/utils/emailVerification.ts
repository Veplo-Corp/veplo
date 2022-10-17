import { sendEmailVerification } from '@firebase/auth';
import { auth } from '../../src/firebase';
export const sendEmailVerificationHanlder = () => {
    if (auth.currentUser) {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                // Email verification sent!
                // ...
                console.log('email inviata');
                
            });
    }
}