import { sendEmailVerification } from '@firebase/auth';
import { auth } from '../../src/config/firebase';
export const sendEmailVerificationHanlder = async () => {
    try {
        if (auth.currentUser) {
             await sendEmailVerification(auth.currentUser)
             return true
        }
    }  catch(e:any){
        console.log(e.code);
        return e.code
    }
    // if (auth.currentUser) {
    //     sendEmailVerification(auth.currentUser)
    //         .then(() => {
    //             // Email verification sent!
    //             // ...
    //             console.log('email inviata');
    //             return true
    //         }).catch((e) => {
    //             console.log(e);
    //             return false
    //         })
    // }
}