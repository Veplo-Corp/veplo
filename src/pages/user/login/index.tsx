import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Desktop_Layout from '../../../../components/atoms/Desktop_Layout';
import Login_or_Registration from '../../../../components/organisms/Login_or_Registration'
import { handleErrorFirebase } from '../../../../components/utils/handleErrorFirebase';
import { setAuthTokenInLocalStorage } from '../../../../components/utils/setAuthTokenInLocalStorage';
import { auth } from '../../../config/firebase';
import { Firebase_User } from '../../../interfaces/firebase_user.interface';
import { handleOpenModal, setModalTitleAndDescription } from '../../store/reducers/modal_error';
import { login } from '../../store/reducers/user';

const index = () => {
  const router = useRouter()
  const { type }: 'registration' | 'login' | 'reset_password' = router.query;

  const [typeForm, settypeForm] = useState<'registration' | 'login' | 'reset_password'>('registration')
  const user: Firebase_User = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user?.shopId) {
      router.push('/shop/prodotti')
    } if (user && !user?.Not_yet_Authenticated_Request) {
      router.push('/')
    }
    if (type) {
      settypeForm(type)
    }
  }, [type])

  const handleSubmit = async (email, password) => {
    if (typeForm === 'registration') {

      try {
        console.log('passa qui');
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // Signed in 
        const user = userCredential.user;
        const idToken = await userCredential.user.getIdToken(true);
        setAuthTokenInLocalStorage(idToken)
        console.log(user);
        dispatch(
          login(
            {
              email: user.email,
              uid: user.uid,
              idToken: idToken,
              isShop: false,
              createdAt: 'now'
            }
          )
        );
        return router.push('/')


      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode);
        console.log(errorCode);
        const errorForModal = handleErrorFirebase(error.code)
        dispatch(setModalTitleAndDescription({
          title: errorForModal?.title,
          description: errorForModal?.description
        }))
      }
    } else{
      console.log('passa qui');
      console.log(email);
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const tokenResult = await userCredential.user.getIdTokenResult();
        const isShop = tokenResult.claims.isShop ? true : false
        // setemail('')
        // setpassword('')
        dispatch(
          login(
            {
              email: userCredential.user.email,
              uid: userCredential.user.uid,
              idToken: tokenResult,
              isShop: false,
              createdAt: 'now'
            }
          )
        );
        return router.push('/')

      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode);
        console.log(error);
        const errorForModal = handleErrorFirebase(errorCode)

        dispatch(setModalTitleAndDescription({
          title: errorForModal?.title,
          description: errorForModal?.description
        }))
        dispatch(handleOpenModal)
      }
    }
  }

  return (
    <Desktop_Layout>
      <Login_or_Registration handleSubmitToPage={handleSubmit} handleType={(type: string) => { settypeForm(type) }} type={typeForm} title={'Registra il tuo account'} />
    </Desktop_Layout>
  )
}

export default index