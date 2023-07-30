import { auth } from "../../src/config/firebase";
import { setAuthTokenInSessionStorage } from "./setAuthTokenInSessionStorage";

const expirationTimeTokenControll: (expirationTime: string) => Promise<boolean> = (expirationTime: string) => {


    return new Promise(async (resolve, reject) => {
        const user = auth.currentUser;

        //check on the expiration date return false if the expiration time is passed
        if (new Date(expirationTime) <= new Date()) {
            console.log('Passaaaa');

            const idToken = await user?.getIdToken(true)
            if (!idToken) {
                window.location.reload()
                return resolve(true)
            }
            //window.location.reload()
            setAuthTokenInSessionStorage(idToken)
            resolve(true)

        }
        resolve(true)
    });





}

export default expirationTimeTokenControll;