import { auth, sendPasswordResetEmail } from "../../src/pages/config/firebase";

const resetPassword = (email:string) => {
        sendPasswordResetEmail(auth, auth.currentUser?.email || email)
        .then(() => {
          // Password reset email sent!
          // ..
          console.log('Password reset email sent!');
          
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    
}

export default resetPassword