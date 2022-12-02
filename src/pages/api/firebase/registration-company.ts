import { sendEmailVerificationHanlder } from './../../../../components/utils/emailVerification';
import { auth, createUserWithEmailAndPassword } from "../../../config/firebase"

type Req = {
    body: {
        email: string,
        password: string,
        typeForm: string
    }
}

export default function handler(req: Req, res:any) {
    // Get data submitted in request's body.
    const body = req.body
    // Optional logging to see the responses
    // in the command line where next.js app is running.

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.email || !body.password) {
        // Sends a HTTP bad request error code
        return res.status(400).json({ data: 'email or password not found' })
    }

    console.log(body.typeForm);

    if (body.typeForm === 'registration') {
        
        createUserWithEmailAndPassword(auth, body.email, body.password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                sendEmailVerificationHanlder()
                // Sends a HTTP success code
                res.status(200).json({ data: user})
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
                res.status(400).json({ data: error.message})
        });
    }



    
}