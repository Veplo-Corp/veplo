import { auth } from "../../src/config/firebase";
import { setAuthTokenInSessionStorage } from "./setAuthTokenInSessionStorage";

const expirationTimeTokenControll: (expirationTime: string) => Promise<boolean> = (expirationTime: string) => {
    return new Promise(async (resolve, reject) => {
        //check on the expiration date return false if the expiration time is passed
        if (new Date(expirationTime) > new Date()) {
            const user = auth.currentUser;
            const idToken = await user?.getIdToken(true)
            if (!idToken) {
                if (typeof window !== 'undefined') {
                    window.location.reload()
                }
                return resolve(true)
            }
            setAuthTokenInSessionStorage(idToken)
            resolve(true)

        }
        resolve(true)
    });





}

export default expirationTimeTokenControll;