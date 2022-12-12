import { sendEmailVerification } from '@firebase/auth';
import { auth } from '../../src/config/firebase';
export const sendEmailVerificationHanlder = async() => {
    if (auth.currentUser) {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                // Email verification sent!
                // ...
                console.log('email inviata');    
            });
    }
}