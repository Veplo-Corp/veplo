import { auth, sendPasswordResetEmail } from "../../src/config/firebase";

const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, auth.currentUser?.email || email)

}

export default resetPassword