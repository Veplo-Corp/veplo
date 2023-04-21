
import { useSelector } from 'react-redux';
import { Firebase_User } from '../../src/interfaces/firebase_user.interface';
import { useRouter } from 'next/router';


const expirationTimeTokenControll: (expirationTime: string) => Promise<boolean> = (expirationTime: string) => {
    return new Promise((resolve, reject) => {
        //check on the expiration date return false if the expiration time is passed
        if (new Date(expirationTime) < new Date()) {

            if (typeof window !== 'undefined') {
                window.location.reload()
            }
            return resolve(false)
        }
        resolve(true)
    });





}

export default expirationTimeTokenControll;