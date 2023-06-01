import { auth, sendPasswordResetEmail } from "../../src/config/firebase";

const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, auth.currentUser?.email || email)
  // .then(() => {
  //   // Password reset email sent!
  //   // ..
  //   console.log('Password reset email sent!');
  //   return true

  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   return false
  //   // ..
  // });

}

export default resetPassword