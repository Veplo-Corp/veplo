import { sendEmailVerification } from '@firebase/auth';
import { auth } from '../../src/config/firebase';
export const sendEmailVerificationHanlder = async () => {
    try {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser)
            return true
        }
    } catch (e: any) {
        return e.code
    }
}